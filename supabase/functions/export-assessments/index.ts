
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get query parameters for filtering
    const url = new URL(req.url)
    const startDate = url.searchParams.get('start_date')
    const endDate = url.searchParams.get('end_date')

    // Fetch all assessment data
    let assessmentsQuery = supabaseClient
      .from('assessments')
      .select(`
        *,
        assessment_responses(*),
        feedback(*),
        assessment_problems(*),
        assessment_solutions(*)
      `)
      .order('created_at', { ascending: false })

    // Apply date filters if provided
    if (startDate) {
      assessmentsQuery = assessmentsQuery.gte('created_at', startDate)
    }
    if (endDate) {
      assessmentsQuery = assessmentsQuery.lte('created_at', endDate)
    }

    const { data: assessments, error } = await assessmentsQuery

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch assessment data' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Excel-like data structure
    const excelData = {
      summary: {
        totalAssessments: assessments?.length || 0,
        dateRange: {
          start: startDate || 'All time',
          end: endDate || 'Present'
        },
        generatedAt: new Date().toISOString()
      },
      assessments: assessments?.map(assessment => ({
        id: assessment.id,
        personalDetails: {
          fullName: assessment.full_name,
          designation: assessment.designation,
          companyName: assessment.company_name
        },
        responses: assessment.assessment_responses || [],
        problems: assessment.assessment_problems || [],
        solutions: assessment.assessment_solutions || [],
        feedback: assessment.feedback || [],
        createdAt: assessment.created_at,
        updatedAt: assessment.updated_at
      })) || []
    }

    // For now, return JSON data. In a full implementation, you would use a library
    // like xlsx to generate actual Excel files
    return new Response(
      JSON.stringify(excelData, null, 2),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="assessments-export-${new Date().toISOString().split('T')[0]}.json"`
        }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
