import { useMutation, useQuery } from '@tanstack/react-query';
import { submitForm, getInsights, submitFinancialAssessment, getAllSubmissions, getAllInsights, submitReview } from '../services/api';

// Hook for form submission
export const useFormSubmission = () => {
  return useMutation({
    mutationFn: submitForm,
    onSuccess: (data) => {
      console.log('Form submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Form submission failed:', error);
    },
  });
};

// Hook for financial assessment submission
export const useFinancialAssessmentSubmission = () => {
  return useMutation({
    mutationFn: submitFinancialAssessment,
    onSuccess: (data) => {
      console.log('Financial assessment submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Financial assessment submission failed:', error);
    },
  });
};

// Hook for getting insights
export const useInsights = (respondentId: string) => {
  return useQuery({
    queryKey: ['insights', respondentId],
    queryFn: () => getInsights(respondentId),
    enabled: !!respondentId,
  });
};

// Hook for getting all submissions (Admin Dashboard)
export const useAllSubmissions = () => {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: () => getAllSubmissions(),
  });
};

// Hook for getting all insights with complete data (Admin Dashboard)
export const useAllInsights = () => {
  return useQuery({
    queryKey: ['insights'],
    queryFn: () => getAllInsights(),
  });
};

// Hook for submitting reviews
export const useReviewSubmission = () => {
  return useMutation({
    mutationFn: submitReview,
    onSuccess: (data) => {
      console.log('Review submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Review submission failed:', error);
    },
  });
};