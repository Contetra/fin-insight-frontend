
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AssessmentService } from '@/services/assessmentService';
import { useToast } from '@/hooks/use-toast';

export const useAssessment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);
  const { toast } = useToast();

  const createAssessment = async (personalDetails: {
    fullName: string;
    designation: string;
    companyName: string;
  }) => {
    setIsLoading(true);
    try {
      const assessment = await AssessmentService.createAssessment({
        full_name: personalDetails.fullName,
        designation: personalDetails.designation,
        company_name: personalDetails.companyName,
        identified_problems: [],
        generated_solutions: [],
        strategic_recommendations: []
      });

      setCurrentAssessmentId(assessment.id);
      console.log('Assessment created with ID:', assessment.id);
      
      toast({
        title: "Assessment Started",
        description: "Your assessment has been created successfully.",
      });

      return assessment;
    } catch (error) {
      console.error('Failed to create assessment:', error);
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveResponses = async (responses: Array<{
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    answerValue: string;
  }>) => {
    if (!currentAssessmentId) {
      throw new Error('No assessment ID available');
    }

    setIsLoading(true);
    try {
      const formattedResponses = responses.map(response => ({
        question_id: response.questionId,
        question_text: response.questionText,
        selected_answer: response.selectedAnswer,
        answer_value: response.answerValue
      }));

      await AssessmentService.saveAssessmentResponses(currentAssessmentId, formattedResponses);
      
      toast({
        title: "Responses Saved",
        description: "Your assessment responses have been saved.",
      });
    } catch (error) {
      console.error('Failed to save responses:', error);
      toast({
        title: "Error",
        description: "Failed to save responses. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveProblemsAndSolutions = async (problems: string[], solutions: string[]) => {
    if (!currentAssessmentId) {
      throw new Error('No assessment ID available');
    }

    setIsLoading(true);
    try {
      // Update the assessment with problems and solutions
      await Promise.all([
        AssessmentService.saveAssessmentProblems(currentAssessmentId, problems),
        AssessmentService.saveAssessmentSolutions(currentAssessmentId, solutions),
        (supabase as any).from('assessments').update({
          identified_problems: problems,
          generated_solutions: solutions
        }).eq('id', currentAssessmentId)
      ]);

      toast({
        title: "Assessment Completed",
        description: "Your problems and solutions have been saved.",
      });
    } catch (error) {
      console.error('Failed to save problems and solutions:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment data. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveFeedback = async (feedbackData: {
    rating?: number;
    emoji?: string;
    message?: string;
  }) => {
    setIsLoading(true);
    try {
      await AssessmentService.saveFeedback({
        assessment_id: currentAssessmentId,
        rating: feedbackData.rating,
        emoji_reaction: feedbackData.emoji,
        written_message: feedbackData.message
      });

      toast({
        title: "Feedback Saved",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error('Failed to save feedback:', error);
      toast({
        title: "Error",
        description: "Failed to save feedback. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    currentAssessmentId,
    createAssessment,
    saveResponses,
    saveProblemsAndSolutions,
    saveFeedback
  };
};
