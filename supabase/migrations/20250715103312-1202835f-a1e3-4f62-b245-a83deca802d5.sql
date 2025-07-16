
-- First, let's add the auto-update trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to auto-update the updated_at column
CREATE TRIGGER assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add updated_at to feedback table (missing from original schema)
ALTER TABLE public.feedback ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

CREATE TRIGGER feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create related tables for better analytics and filtering (future-proofing)
CREATE TABLE public.assessment_problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  problem_text TEXT NOT NULL,
  problem_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.assessment_solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  solution_text TEXT NOT NULL,
  solution_category TEXT,
  priority INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.assessment_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_solutions ENABLE ROW LEVEL SECURITY;

-- Temporary public policies (TO BE REPLACED with auth-based policies)
CREATE POLICY "Temporary public access to assessment_problems" 
  ON public.assessment_problems 
  FOR ALL 
  USING (true);

CREATE POLICY "Temporary public access to assessment_solutions" 
  ON public.assessment_solutions 
  FOR ALL 
  USING (true);

-- Add indexes for the new tables
CREATE INDEX idx_assessment_problems_assessment_id ON public.assessment_problems(assessment_id);
CREATE INDEX idx_assessment_solutions_assessment_id ON public.assessment_solutions(assessment_id);
CREATE INDEX idx_assessment_problems_category ON public.assessment_problems(problem_category);
CREATE INDEX idx_assessment_solutions_category ON public.assessment_solutions(solution_category);

-- Add comments documenting the security concerns
COMMENT ON POLICY "Allow public access to assessments" ON public.assessments 
IS 'TEMPORARY: Replace with auth.uid() based policies before production';
COMMENT ON POLICY "Allow public access to assessment_responses" ON public.assessment_responses 
IS 'TEMPORARY: Replace with auth.uid() based policies before production';
COMMENT ON POLICY "Allow public access to feedback" ON public.feedback 
IS 'TEMPORARY: Replace with auth.uid() based policies before production';
