import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAllInsights } from '@/hooks/useFormApi';
import { Download, FileSpreadsheet, Users, Calendar, Eye, TrendingUp, X, Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InsightData {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: number;
  insightData: Record<string, unknown>;
  createdAt: string;
  submission: {
    id: string;
    formType: string;
    responses: Record<string, unknown>;
    isComplete: boolean;
    submissionDate: string;
    updatedAt: string;
  };
  respondent: {
    id: string;
    name: string;
    email: string;
    companyName: string;
    createdAt: string;
  };
  reviews: Review[];
}

interface Review {
  id: string;
  rating: number;
  reaction: string;
  feedback: string;
  created_at: string;
}

// Component to display responses in popup
const ResponsesModal = ({ responses }: { responses: Record<string, unknown> }) => {
  const questionsWithResponses = (responses as Record<string, unknown>)?.questionsWithResponses as Array<{
    questionId: string;
    questionText: string;
    questionDescription: string;
    multiSelect: boolean;
    selectedOptions: Array<{
      id: string;
      text: string;
      description: string;
      problem: string;
    }>;
  }> || [];
  
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Assessment Responses</h3>
      {questionsWithResponses.length > 0 ? (
        questionsWithResponses.map((question, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-2">{question.questionText}</h4>
            <p className="text-sm text-gray-600 mb-3">{question.questionDescription}</p>
            <div className="space-y-2">
              {question.selectedOptions?.map((option, optIndex) => (
                <div key={optIndex} className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <div className="font-medium text-blue-900">{option.text}</div>
                  <div className="text-sm text-blue-600">{option.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No detailed responses available.</p>
      )}
    </div>
  );
};

// --- Add stage calculation logic from Index.tsx ---
const calculateStage = (selectedAnswers: Record<string, string[]>) => {
  const values: number[] = [];
  Object.values(selectedAnswers).forEach(optionIds => {
    optionIds.forEach(optionId => {
      const num = parseInt(optionId);
      if (!isNaN(num)) values.push(num);
    });
  });
  if (values.length === 0) return 1;
  const freq: Record<number, number> = {};
  values.forEach(num => {
    freq[num] = (freq[num] || 0) + 1;
  });
  const uniqueOptions = Object.keys(freq).map(Number);
  if (uniqueOptions.length === 1) return uniqueOptions[0];
  if (uniqueOptions.length === values.length) return Math.max(...uniqueOptions);
  const maxCount = Math.max(...Object.values(freq));
  const mostFrequent = uniqueOptions.filter(num => freq[num] === maxCount);
  if (mostFrequent.length > 1) {
    const avg = mostFrequent.reduce((sum, n) => sum + n, 0) / mostFrequent.length;
    return Math.floor(avg);
  }
  return mostFrequent[0];
};
const getStageDetails = (stage: number) => {
  const stageDetails = {
    1: {
      title: "Stage 1",
      subtitle: "Manual & Fragmented",
      description: "Diagnostic reviews, quick-win automations, books clean-up, MIS services"
    },
    2: {
      title: "Stage 2",
      subtitle: "Standardised & Controlled",
      description: "Finance process standardisation, data clean-ups, ERP fitment/rollout, FPA as a service"
    },
    3: {
      title: "Stage 3",
      subtitle: "Automated & Integrated",
      description: "Full ERP implementation, automation scripts, RPA, reporting automation"
    },
    4: {
      title: "Stage 4",
      subtitle: "Data-Driven & Predictive",
      description: "FPA as a service, CFO support, predictive analytics automation"
    },
    5: {
      title: "Stage 5",
      subtitle: "Strategic & Scalable",
      description: "Technical Acc, Outsourcing, IFRS/US GAAP advisory, legacy ERP overhaul"
    }
  };
  return stageDetails[stage as keyof typeof stageDetails] || stageDetails[1];
};
// --- Replace ProblemsModal with ResultStageModal ---
const ResultStageModal = ({ responses }: { responses: Record<string, unknown> }) => {
  const selectedAnswers = (responses as Record<string, unknown>)?.assessmentAnswers as Record<string, string[]> || {};
  const stage = calculateStage(selectedAnswers);
  const stageDetails = getStageDetails(stage);
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto text-center">
      <h3 className="text-lg font-semibold mb-4">Result Stage</h3>
      <div className="text-2xl font-bold mb-2">{stageDetails.title}: {stageDetails.subtitle}</div>
      <div className="text-base text-gray-700 mb-2">{stageDetails.description}</div>
    </div>
  );
};

// Component to display reviews in popup
const ReviewsModal = ({ reviews }: { reviews: Review[] }) => {
  const getEmojiForReaction = (reaction: string) => {
    switch (reaction) {
      case 'Great': return '😊';
      case 'Loved it': return '❤️';
      case 'Excellent': return '🔥';
      case 'Amazing': return '⚡';
      default: return '😊';
    }
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getEmojiForReaction(review.reaction)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{review.reaction}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                </div>
              </div>
              {review.feedback && (
                <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <p className="text-gray-700 text-sm italic">"{review.feedback}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews available.</p>
      )}
    </div>
  );
};

export const AdminDashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();
  
  // Use the hook to get insights with complete data
  const { data: insightsData, isLoading, error } = useAllInsights();
  const insights = insightsData?.data || [];

  // Get unique submissions for statistics
  const uniqueSubmissions = insights.reduce((unique, insight) => {
    const existingSubmission = unique.find(u => u.submissionId === insight.submission.id);
    if (!existingSubmission) {
      unique.push({
        submissionId: insight.submission.id,
        respondentId: insight.respondent.id,
        submissionDate: insight.submission.submissionDate,
        respondent: insight.respondent,
        formType: insight.submission.formType,
        isComplete: insight.submission.isComplete,
        reviews: insights.filter(i => i.respondent.id === insight.respondent.id).reduce((allReviews, i) => {
          return [...allReviews, ...i.reviews];
        }, [] as Review[])
      });
    }
    return unique;
  }, [] as Array<{
    submissionId: string;
    respondentId: string;
    submissionDate: string;
    respondent: { id: string; name: string; email: string; companyName: string; createdAt: string };
    formType: string;
    isComplete: boolean;
    reviews: Review[];
  }>).sort((a, b) => {
    // Sort by submission date descending (latest first)
    return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
  });

  // Pagination logic
  const totalPages = Math.ceil(uniqueSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubmissions = uniqueSubmissions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Show error if API call fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load insights.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const exportToExcel = async () => {
    try {
      const exportData = insights.map(insight => ({
        // Respondent Info
        respondentId: insight.respondent.id,
        respondentName: insight.respondent.name,
        respondentEmail: insight.respondent.email,
        companyName: insight.respondent.companyName,
        respondentCreatedAt: insight.respondent.createdAt,
        
        // Submission Info
        submissionId: insight.submission.id,
        formType: insight.submission.formType,
        submissionDate: insight.submission.submissionDate,
        isComplete: insight.submission.isComplete,
        submissionUpdatedAt: insight.submission.updatedAt,
        
        // Insight Info
        insightId: insight.id,
        insightTitle: insight.title,
        insightContent: insight.content,
        insightCategory: insight.category,
        insightPriority: insight.priority,
        insightCreatedAt: insight.createdAt,
        
        // Form Responses and Insight Data
        responses: insight.submission.responses,
        insightData: insight.insightData,
      }));

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = `insights-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      toast({
        title: "Success",
        description: "Insights data exported successfully.",
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
          <div className="text-lg">Loading insights...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard - Financial Insights</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSubmissions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSubmissions.filter(s => s.isComplete).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueSubmissions.filter(s => 
                new Date(s.submissionDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, uniqueSubmissions.length)} of {uniqueSubmissions.length} entries
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSubmissions.map((submission) => {
                const responses = insights.find(i => i.submission.id === submission.submissionId)?.submission.responses || {};
                const personalDetails = (responses as Record<string, unknown>)?.personalDetails as Record<string, string> || {};
                
                return (
                  <TableRow key={submission.submissionId}>
                    <TableCell className="font-medium">{submission.respondent.name}</TableCell>
                    <TableCell>{submission.respondent.email}</TableCell>
                    <TableCell>{submission.respondent.companyName}</TableCell>
                    <TableCell>{personalDetails.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>{new Date(submission.submissionDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        submission.isComplete 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {submission.isComplete ? 'Completed' : 'In Progress'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {submission.reviews.length > 0 ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {submission.reviews.length} review{submission.reviews.length > 1 ? 's' : ''}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.round(submission.reviews.reduce((sum, r) => sum + r.rating, 0) / submission.reviews.length)
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No reviews</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Responses
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Responses for {submission.respondent.name}</DialogTitle>
                            </DialogHeader>
                            <ResponsesModal responses={responses} />
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Result Stage
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Result Stage for {submission.respondent.name}</DialogTitle>
                            </DialogHeader>
                            <ResultStageModal responses={responses} />
                          </DialogContent>
                        </Dialog>

                        {submission.reviews.length > 0 && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>Reviews</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Reviews for {submission.respondent.name}</DialogTitle>
                              </DialogHeader>
                              <ReviewsModal reviews={submission.reviews} />
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
