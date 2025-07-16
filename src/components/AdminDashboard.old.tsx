
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAllSubmissions } from '@/hooks/useFormApi';
import { Download, FileSpreadsheet, Users, Calendar } from 'lucide-react';

interface Submission {
  id: string;
  respondentId: string;
  formType: string;
  responses: Record<string, unknown>;
  isComplete: boolean;
  submissionDate: string;
  respondent: {
    id: string;
    name: string;
    email: string;
    companyName: string;
  };
}

export const AdminDashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { toast } = useToast();
  
  // Use the hook to get submissions
  const { data: submissionsData, isLoading, error } = useAllSubmissions();
  const submissions = submissionsData?.data || [];

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSubmissions();
      setSubmissions(data.data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getAllSubmissions();
        setSubmissions(data.data);
      } catch (error) {
        console.error('Failed to load submissions:', error);
        toast({
          title: "Error",
          description: "Failed to load submissions.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  const exportToExcel = async () => {
    setIsLoading(true);
    try {
      const baseUrl = 'https://fypwyfkdwjeunrediyww.supabase.co/functions/v1/export-assessments';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const url = params.toString() ? `${baseUrl}?${params}` : baseUrl;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5cHd5Zmtkd2pldW5yZWRpeXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzI1MDUsImV4cCI6MjA2ODE0ODUwNX0.e7SX9hIohJDRC8wsDdXVNa9IuSxLQkAQ-087wlYWQZc`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `assessments-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Export Successful",
        description: "Assessment data has been exported successfully.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export assessment data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assessment Admin Dashboard</h1>
        <Button onClick={exportToExcel} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter(s => 
                new Date(s.submissionDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export Ready</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ready</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.slice(0, 10).map((submission) => (
              <div key={submission.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{submission.respondent.name}</h3>
                  <p className="text-sm text-gray-600">{submission.respondent.companyName} - {submission.respondent.email}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(submission.submissionDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {submission.isComplete ? 'Completed' : 'In Progress'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
