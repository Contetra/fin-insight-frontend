
import { supabase } from "@/integrations/supabase/client";
import { Assessment, AssessmentResponse, Feedback, AssessmentProblem, AssessmentSolution } from "@/types/assessment";

export class AssessmentService {
  // Create a new assessment with personal details
  static async createAssessment(data: {
    full_name: string;
    designation: string;
    company_name: string;
    identified_problems: string[];
    generated_solutions: string[];
    strategic_recommendations: string[];
  }): Promise<Assessment> {
    console.log('Creating assessment:', data);
    
    const { data: assessment, error } = await (supabase as any)
      .from('assessments')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }

    console.log('Assessment created successfully:', assessment);
    return assessment;
  }

  // Save assessment responses
  static async saveAssessmentResponses(assessmentId: string, responses: {
    question_id: string;
    question_text: string;
    selected_answer: string;
    answer_value: string;
  }[]): Promise<AssessmentResponse[]> {
    console.log('Saving assessment responses for:', assessmentId, responses);
    
    const responseData = responses.map(response => ({
      assessment_id: assessmentId,
      ...response
    }));

    const { data, error } = await (supabase as any)
      .from('assessment_responses')
      .insert(responseData)
      .select();

    if (error) {
      console.error('Error saving assessment responses:', error);
      throw error;
    }

    console.log('Assessment responses saved successfully:', data);
    return data;
  }

  // Save feedback
  static async saveFeedback(data: {
    assessment_id?: string;
    rating?: number;
    emoji_reaction?: string;
    written_message?: string;
    profile_photo_url?: string;
  }): Promise<Feedback> {
    console.log('Saving feedback:', data);
    
    const { data: feedback, error } = await (supabase as any)
      .from('feedback')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }

    console.log('Feedback saved successfully:', feedback);
    return feedback;
  }

  // Save problems as separate records
  static async saveAssessmentProblems(assessmentId: string, problems: string[]): Promise<AssessmentProblem[]> {
    console.log('Saving assessment problems for:', assessmentId, problems);
    
    const problemData = problems.map(problem => ({
      assessment_id: assessmentId,
      problem_text: problem,
      problem_category: 'user_identified'
    }));

    const { data, error } = await (supabase as any)
      .from('assessment_problems')
      .insert(problemData)
      .select();

    if (error) {
      console.error('Error saving assessment problems:', error);
      throw error;
    }

    console.log('Assessment problems saved successfully:', data);
    return data;
  }

  // Save solutions as separate records
  static async saveAssessmentSolutions(assessmentId: string, solutions: string[]): Promise<AssessmentSolution[]> {
    console.log('Saving assessment solutions for:', assessmentId, solutions);
    
    const solutionData = solutions.map((solution, index) => ({
      assessment_id: assessmentId,
      solution_text: solution,
      solution_category: 'generated',
      priority: index + 1
    }));

    const { data, error } = await (supabase as any)
      .from('assessment_solutions')
      .insert(solutionData)
      .select();

    if (error) {
      console.error('Error saving assessment solutions:', error);
      throw error;
    }

    console.log('Assessment solutions saved successfully:', data);
    return data;
  }

  // Get all assessments for admin view
  static async getAllAssessments(): Promise<Assessment[]> {
    const { data, error } = await (supabase as any)
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }

    return data || [];
  }

  // Get assessment with all related data
  static async getAssessmentWithDetails(assessmentId: string) {
    const [assessment, responses, feedback, problems, solutions] = await Promise.all([
      (supabase as any).from('assessments').select('*').eq('id', assessmentId).single(),
      (supabase as any).from('assessment_responses').select('*').eq('assessment_id', assessmentId),
      (supabase as any).from('feedback').select('*').eq('assessment_id', assessmentId),
      (supabase as any).from('assessment_problems').select('*').eq('assessment_id', assessmentId),
      (supabase as any).from('assessment_solutions').select('*').eq('assessment_id', assessmentId)
    ]);

    return {
      assessment: assessment.data,
      responses: responses.data || [],
      feedback: feedback.data || [],
      problems: problems.data || [],
      solutions: solutions.data || []
    };
  }
}
