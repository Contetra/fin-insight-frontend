
export interface Assessment {
  id: string;
  full_name: string;
  company_name: string;
  identified_problems: string[];
  generated_solutions: string[];
  strategic_recommendations: string[];
  created_at: string;
  updated_at: string;
}

export interface AssessmentResponse {
  id: string;
  assessment_id: string;
  question_id: string;
  question_text: string;
  selected_answer: string;
  answer_value: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  assessment_id: string;
  rating: number;
  emoji_reaction: string;
  written_message: string;
  profile_photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentProblem {
  id: string;
  assessment_id: string;
  problem_text: string;
  problem_category?: string;
  created_at: string;
}

export interface AssessmentSolution {
  id: string;
  assessment_id: string;
  solution_text: string;
  solution_category?: string;
  priority?: number;
  created_at: string;
}
