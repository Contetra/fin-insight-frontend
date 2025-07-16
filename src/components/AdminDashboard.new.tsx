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

  // Show error if API call fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load submissions.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const exportToExcel = async () => {
    try {
      const dataStr = JSON.stringify(submissions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = `submissions-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      toast({
        title: "Success",
        description: "Data exported successfully.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Error",
        description: "Failed to export data.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading submissions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            className="w-40"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            className="w-40"
          />
          <Button onClick={exportToExcel} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter(s => s.isComplete).length}
            </div>
          </CardContent>
        </Card>
      </div>

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
