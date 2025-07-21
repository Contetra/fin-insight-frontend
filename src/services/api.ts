import axios from 'axios';

const API_BASE_URL = 'https://fin-insight-backend-contetrauniversal-4609-contetras-projects.vercel.app/form';
// const API_BASE_URL = 'http://localhost:5001/form/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-vercel-protection-bypass': 'Aakshita11Aakshita11Aakshita11Aa',
  },
});

// Types for API responses (matching your backend sendSuccess format)
export interface SubmissionResponse {
  message: string;
  data: Array<{
    submissionId: string;
    respondentId: string;
    insights: Array<{
      title: string;
      content: string;
      category: string;
      priority: number;
      data: Record<string, unknown>;
    }>;
  }>;
  code: number;
}

export interface InsightResponse {
  data: Array<{
    id: string;
    submissionId: string;
    respondentId: string;
    title: string;
    content: string;
    category: string;
    priority: number;
    data: Record<string, unknown>;
    created_at: string;
  }>;
  message: string;
}

// Submit form data
export const submitForm = async (formData: {
  name: string;
  email: string;
  companyName: string;
  formType: string;
  responses: Record<string, unknown>;
}): Promise<SubmissionResponse> => {
  const response = await api.post('/submissions', formData);
  return response.data;
};

// Get insights for a respondent
export const getInsights = async (respondentId: string, includeDetails: boolean = false): Promise<InsightResponse> => {
  const response = await api.get(`/insights/${respondentId}?includeDetails=${includeDetails}`);
  return response.data;
};

// Get all insights with complete data (for dashboard)
export const getAllInsights = async (): Promise<{
  data: Array<{
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
    reviews: Array<{
      id: string;
      rating: number;
      reaction: string;
      feedback: string;
      created_at: string;
    }>;
  }>;
  message: string;
}> => {
  const response = await api.get('/insights');
  return response.data;
};

// Helper function to submit financial assessment form
export const submitFinancialAssessment = async (formData: {
  fullName: string;
  designation: string;
  companyName: string;
  phoneNumber?: string;
  selectedAnswers: Record<string, string[]>;
  questionsWithResponses: Array<{
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
  }>;
  identifiedProblems: string[];
}): Promise<SubmissionResponse> => {
  const { fullName, designation, companyName, phoneNumber, selectedAnswers, questionsWithResponses, identifiedProblems } = formData;

  // Create email from name and company
  const email = `${fullName.toLowerCase().replace(/\s+/g, '.')}@${companyName.toLowerCase().replace(/\s+/g, '')}.com`;

  const personalDetails: any = { fullName, designation, companyName };
  if (phoneNumber) personalDetails.phoneNumber = phoneNumber;

  const submissionData = {
    name: fullName,
    email: email,
    companyName: companyName,
    formType: 'financial-assessment',
    responses: {
      personalDetails,
      assessmentAnswers: selectedAnswers,
      questionsWithResponses: questionsWithResponses,
      identifiedProblems: identifiedProblems,
      submissionTimestamp: new Date().toISOString(),
    },
  };

  const response = await api.post('/submissions', submissionData);
  return response.data;
};

// Get all submissions for admin dashboard
export const getAllSubmissions = async (): Promise<{
  data: Array<{
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
  }>;
  message: string;
}> => {
  const response = await api.get('/submissions');
  return response.data;
};

// Submit a review
export const submitReview = async (reviewData: {
  respondentId: string;
  rating: number;
  reaction: string;
  feedback: string;
}): Promise<{
  data: Array<{
    id: string;
    respondentId: string;
    rating: number;
    reaction: string;
    feedback: string;
    created_at: string;
  }>;
  message: string;
  code: number;
}> => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export default api;