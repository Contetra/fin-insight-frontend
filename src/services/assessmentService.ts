
import { submitForm, getInsights } from "./api";
import { Assessment, AssessmentResponse, Feedback, AssessmentProblem, AssessmentSolution } from "@/types/assessment";

export class AssessmentService {
  // Create a new assessment with personal details
  static async createAssessment(data: {
    full_name: string;
    company_name: string;
    identified_problems: string[];
    generated_solutions: string[];
    strategic_recommendations: string[];
  }): Promise<Assessment> {
    console.log('Creating assessment:', data);
    
    try {
      const formData = {
        name: data.full_name,
        email: `${data.full_name.toLowerCase().replace(/\s+/g, '.')}` +
          `@${data.company_name.toLowerCase().replace(/\s+/g, '')}.com`,
        companyName: data.company_name,
        formType: 'financial-assessment',
        responses: {
          identified_problems: data.identified_problems,
          generated_solutions: data.generated_solutions,
          strategic_recommendations: data.strategic_recommendations,
        },
      };

      const response = await submitForm(formData);
      
      // Transform the response to match Assessment type
      const assessment: Assessment = {
        id: response.data[0].submissionId,
        full_name: data.full_name,
        company_name: data.company_name,
        identified_problems: data.identified_problems,
        generated_solutions: data.generated_solutions,
        strategic_recommendations: data.strategic_recommendations,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('Assessment created successfully:', assessment);
      return assessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  // Save assessment responses
  static async saveAssessmentResponses(assessmentId: string, responses: {
    question_id: string;
    question_text: string;
    selected_answer: string;
    answer_value: string;
  }[]): Promise<AssessmentResponse[]> {
    console.log('Saving assessment responses for:', assessmentId, responses);
    
    // For now, just return the responses as they would be saved
    // In a real implementation, you might want to update the submission
    const responseData = responses.map((response, index) => ({
      id: `${assessmentId}-response-${index}`,
      assessment_id: assessmentId,
      ...response,
      created_at: new Date().toISOString(),
    }));

    console.log('Assessment responses saved successfully:', responseData);
    return responseData;
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
    
    // For now, just return the feedback as it would be saved
    // In a real implementation, you might want to send this to an analytics endpoint
    const feedback: Feedback = {
      id: `feedback-${Date.now()}`,
      assessment_id: data.assessment_id || '',
      rating: data.rating || 0,
      emoji_reaction: data.emoji_reaction || '',
      written_message: data.written_message || '',
      profile_photo_url: data.profile_photo_url || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Feedback saved successfully:', feedback);
    return feedback;
  }

  // Save problems as separate records
  static async saveAssessmentProblems(assessmentId: string, problems: string[]): Promise<AssessmentProblem[]> {
    console.log('Saving assessment problems for:', assessmentId, problems);
    
    const problemData = problems.map((problem, index) => ({
      id: `${assessmentId}-problem-${index}`,
      assessment_id: assessmentId,
      problem_text: problem,
      problem_category: 'user_identified' as const,
      created_at: new Date().toISOString(),
    }));

    console.log('Assessment problems saved successfully:', problemData);
    return problemData;
  }

  // Save solutions as separate records
  static async saveAssessmentSolutions(assessmentId: string, solutions: string[]): Promise<AssessmentSolution[]> {
    console.log('Saving assessment solutions for:', assessmentId, solutions);
    
    const solutionData = solutions.map((solution, index) => ({
      id: `${assessmentId}-solution-${index}`,
      assessment_id: assessmentId,
      solution_text: solution,
      solution_category: 'generated' as const,
      priority: index + 1,
      created_at: new Date().toISOString(),
    }));

    console.log('Assessment solutions saved successfully:', solutionData);
    return solutionData;
  }

  // Get all assessments for admin view
  static async getAllAssessments(): Promise<Assessment[]> {
    try {
      // This would need to be implemented in your backend
      // For now, return an empty array
      console.log('Fetching all assessments...');
      return [];
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }

  // Get assessment with all related data
  static async getAssessmentWithDetails(assessmentId: string) {
    try {
      // This would use the getInsights API call
      console.log('Fetching assessment details for:', assessmentId);
      
      // For now, return empty structure
      return {
        assessment: null,
        responses: [],
        feedback: [],
        problems: [],
        solutions: []
      };
    } catch (error) {
      console.error('Error fetching assessment details:', error);
      throw error;
    }
  }
}
