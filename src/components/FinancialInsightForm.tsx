import { useState } from "react";
import { useFormSubmission } from "../hooks/useFormApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

// Define the form data structure
interface FormData {
  name: string;
  email: string;
  companyName: string;
  formType: string;
  responses: Record<string, unknown>;
}

export function FinancialInsightForm() {
  // Initial form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    companyName: "",
    formType: "financial-assessment",
    responses: {}
  });

  // Use the submission hook
  const { mutate, isPending, isSuccess, isError, error } = useFormSubmission();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Submit form
    mutate(formData, {
      onSuccess: (data) => {
        toast({
          title: "Success!",
          description: "Your financial assessment has been submitted.",
        });
        console.log("Submission successful:", data);
        
        // Reset form or redirect
        // setFormData({ name: "", email: "", companyName: "", formType: "financial-assessment", responses: {} });
      },
      onError: (err) => {
        toast({
          title: "Submission Failed",
          description: "There was a problem submitting your assessment.",
          variant: "destructive"
        });
        console.error("Submission error:", err);
      }
    });
  };

  // Update form data
  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update responses object
  const updateResponse = (questionId: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: {
          questionId,
          value
        }
      }
    }));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Financial Insights Assessment</CardTitle>
        <CardDescription>
          Complete this assessment to receive personalized financial insights for your business.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormField("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormField("email", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormField("companyName", e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Financial Questions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Financial Information</h3>
            
            {/* Question 1 */}
            <div className="space-y-2">
              <Label htmlFor="q1">What is your company's annual revenue?</Label>
              <Input 
                id="q1"
                type="number" 
                placeholder="Annual revenue in $"
                onChange={(e) => updateResponse("annual_revenue", Number(e.target.value))}
              />
            </div>
            
            {/* Question 2 */}
            <div className="space-y-2">
              <Label htmlFor="q2">What are your primary financial goals?</Label>
              <Textarea 
                id="q2"
                placeholder="Describe your financial goals..."
                onChange={(e) => updateResponse("financial_goals", e.target.value)}
              />
            </div>
            
            {/* Question 3 */}
            <div className="space-y-2">
              <Label htmlFor="q3">What is your current biggest financial challenge?</Label>
              <Textarea 
                id="q3"
                placeholder="Describe your challenges..."
                onChange={(e) => updateResponse("financial_challenges", e.target.value)}
              />
            </div>
            
            {/* Add more questions as needed */}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Assessment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
