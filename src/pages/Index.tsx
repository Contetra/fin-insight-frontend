import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


import {
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Calculator,
  Target,
  Users,
  X,
  Trophy,
  Flame,
  PartyPopper,
  Eye,
  ThumbsUp,
  Heart,
  Zap,
  Calendar,
  ExternalLink,
  Star,
  Loader2,
  RefreshCwOff,
  FolderSync,
  Layers,
  KeyboardOff,
} from "lucide-react";


import {
  useFinancialAssessmentSubmission,
  useReviewSubmission,
} from "@/hooks/useFormApi";
import { Layer } from "recharts";

interface PersonalDetails {
  fullName: string;
  companyName: string;
  phoneNumber: string;
}

interface Question {
  id: string;
  text: string;
  description: string;
  options: {
    id: string;
    text: string;
    description: string;
    problem: string;
    icon: typeof TrendingUp;
  }[];
  multiSelect: boolean;
}

interface Solution {
  problem: string;
  icon: typeof TrendingUp;
  solution: string;
  heistDescription: string;
}

interface Feedback {
  id: string;
  name: string;
  rating: number;
  reaction: string;
  message: string;
  timestamp: number;
}

interface StageDetails {
  title: string;
  subtitle: string;
  description: string;
  problems: string[];
  solutions: string[];
}

const questions: Question[] = [
  {
    id: "excel-chaos",
    text: "Be Honest",
    description: "How chaotic (or smooth) is your Excel situation?",
    multiSelect: false,
    options: [
      {
        id: "1",
        text: "Disjointed Excel",
        description: "",
        problem: "",
        icon: Calculator,
      },
      {
        id: "2",
        text: "Very basic dashboards",
        description: "",
        problem: "",
        icon: Calculator,
      },
      {
        id: "3",
        text: "Real-time data flows between spreadsheets",
        description: "",
        problem: "",
        icon: Calculator,
      },
      {
        id: "4",
        text: "Dynamic MIS and macros",
        description: "",
        problem: "",
        icon: Calculator,
      },
      {
        id: "5",
        text: "Predictive Analysis",
        description: "",
        problem: "",
        icon: Calculator,
      },
    ],
  },
  {
    id: "erp-reality",
    text: "ERP Reality Check",
    description: "Where does your ERP journey stand today?",
    multiSelect: false,
    options: [
      {
        id: "1",
        text: "Accounting is on Tally, no other major tools",
        description: "",
        problem: "",
        icon: Shield,
      },
      {
        id: "2",
        text: "Patchwork ERP/Systems in silo",
        description: "",
        problem: "",
        icon: Shield,
      },
      {
        id: "3",
        text: "Sophisticated ERP system but no integrations",
        description: "",
        problem: "",
        icon: Shield,
      },
      {
        id: "4",
        text: "Highly automated integrations and ERP system",
        description: "",
        problem: "",
        icon: Shield,
      },
      {
        id: "5",
        text: "Only Financial Statement preparation is manual (Everything else is automated within the ERP/outside the ERP)",
        description: "",
        problem: "",
        icon: Shield,
      },
    ],
  },
  {
    id: "manual-misery",
    text: "Manual Work Misery",
    description: "How much is your finance team stuck in manual mode?",
    multiSelect: false,
    options: [
      {
        id: "1",
        text: "Excessive manual work",
        description: "",
        problem: "",
        icon: Flame,
      },
      {
        id: "2",
        text: "Mostly manual work, but accounting is on ERP",
        description: "",
        problem: "",
        icon: Flame,
      },
      {
        id: "3",
        text: "Core finance on ERP, reconciliations done outside the system",
        description: "",
        problem: "",
        icon: Flame,
      },
      {
        id: "4",
        text: "Completely automated, but scope for improvement",
        description: "",
        problem: "",
        icon: Flame,
      },
      {
        id: "5",
        text: "Investment-ready/global best practices adopted",
        description: "",
        problem: "",
        icon: Flame,
      },
    ],
  },
  {
    id: "process-discipline",
    text: "Process Discipline",
    description: "How solid are your finance processes on paper?",
    multiSelect: false,
    options: [
      {
        id: "1",
        text: "No documented SOPs",
        description: "",
        problem: "",
        icon: Target,
      },
      {
        id: "2",
        text: "Processes are consistent, but not linked to best practices",
        description: "",
        problem: "",
        icon: Target,
      },
      {
        id: "3",
        text: "Best practices adopted, not sure of adherence",
        description: "",
        problem: "",
        icon: Target,
      },
      {
        id: "4",
        text: "Documented and adopted best practices",
        description: "",
        problem: "",
        icon: Target,
      },
      {
        id: "5",
        text: "IFC, ICFR and all ELCs (Entity Level Controls) in place",
        description: "",
        problem: "",
        icon: Target,
      },
    ],
  },
];

const solutions: Solution[] = [
  {
    problem: "Strategic Direction Gaps",
    icon: Target,
    solution:
      "Develop comprehensive strategic frameworks with clear direction and measurable objectives.",
    heistDescription:
      "Your Strategist will map out the perfect plan with precision targeting and clear escape routes.",
  },
  {
    problem: "Technology & Automation Needs",
    icon: Calculator,
    solution:
      "Implement cutting-edge automation systems and technical infrastructure optimization.",
    heistDescription:
      "The Hacker will infiltrate your systems and automate everything that slows you down.",
  },
  {
    problem: "Brand Identity Challenges",
    icon: Eye,
    solution:
      "Create cohesive brand identity systems with consistent visual and messaging frameworks.",
    heistDescription:
      "The Disguiser will craft the perfect brand identity that makes you unrecognizable to competitors.",
  },
  {
    problem: "Value Communication Issues",
    icon: Target,
    solution:
      "Develop clear value proposition frameworks and communication strategies.",
    heistDescription:
      "We'll make your value so clear, customers will be drawn to you like a magnet.",
  },
  {
    problem: "Brand Consistency Problems",
    icon: Eye,
    solution:
      "Establish comprehensive brand guidelines and consistency monitoring systems.",
    heistDescription:
      "Every touchpoint will perfectly disguise your true competitive advantage.",
  },
  {
    problem: "Revenue Volatility",
    icon: TrendingUp,
    solution:
      "Create predictable revenue systems with diversified income streams and optimization.",
    heistDescription:
      "We'll steal back your revenue predictability with foolproof systems.",
  },
  {
    problem: "Resource Allocation Issues",
    icon: Shield,
    solution:
      "Optimize resource allocation through priority frameworks and efficiency systems.",
    heistDescription:
      "Every resource will be deployed with surgical precision for maximum impact.",
  },
  {
    problem: "Strategic Clarity Gaps",
    icon: Eye,
    solution:
      "Provide comprehensive strategic clarity through structured planning and decision frameworks.",
    heistDescription:
      "Clear vision will be your greatest weapon in this mission.",
  },
  {
    problem: "Expert Consultation Requirements",
    icon: Trophy,
    solution:
      "Provide expert consultation and strategic guidance tailored to your specific challenges.",
    heistDescription:
      "Consider us your master planners for the perfect strategic heist.",
  },
  {
    problem: "Revenue Growth Objectives",
    icon: TrendingUp,
    solution:
      "Deploy revenue growth strategies with scalable systems and performance optimization.",
    heistDescription:
      "We'll steal market share and boost your revenue like professional thieves.",
  },
  {
    problem: "Brand Visibility Enhancement",
    icon: Eye,
    solution:
      "Amplify brand visibility through strategic positioning and market presence optimization.",
    heistDescription:
      "You'll be impossible to ignore while staying perfectly disguised from competitors.",
  },
  {
    problem: "Strategic Confidence Building",
    icon: Target,
    solution:
      "Build strategic confidence through data-driven insights and proven frameworks.",
    heistDescription:
      "You'll move with the confidence of a master thief who's planned the perfect heist.",
  },
  {
    problem: "Urgent Implementation Timeline",
    icon: Flame,
    solution:
      "Execute rapid implementation strategies with accelerated timelines and intensive support.",
    heistDescription:
      "We'll execute this heist at lightning speed - in and out before anyone knows what happened.",
  },
  {
    problem: "Short-term Implementation Goals",
    icon: TrendingUp,
    solution:
      "Deliver quick wins through focused short-term implementation with immediate impact.",
    heistDescription: "Your first successful heist will happen within 30 days.",
  },
  {
    problem: "Strategic Timeline Planning",
    icon: Target,
    solution:
      "Develop strategic timelines with phased implementation and milestone tracking.",
    heistDescription:
      "Every phase of your heist will be timed to perfection over the next 2-3 months.",
  },
];

const defaultSolutions: Solution[] = [
  {
    problem: "Strategic Foundation Building",
    icon: Target,
    solution:
      "Establish strong strategic foundations with comprehensive planning and clear objectives.",
    heistDescription:
      "Even master thieves need a solid plan - we'll help you build the perfect strategic foundation.",
  },
  {
    problem: "Brand Development Excellence",
    icon: Eye,
    solution:
      "Create compelling brand identity and consistent visual communication systems.",
    heistDescription:
      "Your brand will be so captivating, customers won't be able to resist your charm.",
  },
  {
    problem: "Growth Acceleration Strategy",
    icon: TrendingUp,
    solution:
      "Implement proven growth strategies and optimization systems for sustainable expansion.",
    heistDescription:
      "We'll help you steal the show and dominate your market with precision execution.",
  },
];

// --- STAGE LOGIC (from index2.tsx, adapted) ---
const calculateStage = (selectedAnswers: Record<string, string[]>) => {
  const values: number[] = [];
  Object.values(selectedAnswers).forEach((optionIds) => {
    optionIds.forEach((optionId) => {
      const num = parseInt(optionId);
      if (!isNaN(num)) values.push(num);
    });
  });

  if (values.length === 0) return 1;

  const freq: Record<number, number> = {};
  values.forEach((num) => {
    freq[num] = (freq[num] || 0) + 1;
  });

  const uniqueOptions = Object.keys(freq).map(Number);

  // 1. All same
  if (uniqueOptions.length === 1) {
    return uniqueOptions[0];
  }

  // 2. All different
  if (uniqueOptions.length === values.length) {
    return Math.max(...uniqueOptions);
  }

  // 3. Tie for most frequent
  const maxCount = Math.max(...Object.values(freq));
  const mostFrequent = uniqueOptions.filter((num) => freq[num] === maxCount);

  if (mostFrequent.length > 1) {
    // Tie: take the average of the tied options, then floor
    const avg =
      mostFrequent.reduce((sum, n) => sum + n, 0) / mostFrequent.length;
    return Math.floor(avg);
  }

  // 4. One option is most frequent
  return mostFrequent[0];
};

const getStageDetails = (stage: number) => {
  const stageDetails = {
    1: {
      title: "Stage 1",
      subtitle: "Manual & Fragmented",
      description:
        "Diagnostic reviews, quick-win automations, books clean-up, MIS services",
      problems: [
        "Heavy reliance on manual Excel processes",
        "Basic accounting system with limited integration",
        "Excessive manual work in finance operations",
        "No documented standard operating procedures",
      ],
      solutions: [
        "Conduct diagnostic review of current processes",
        "Implement quick-win automation solutions",
        "Clean up and organize financial books",
        "Establish basic MIS reporting services",
      ],
    },
    2: {
      title: "Stage 2",
      subtitle: "Standardised & Controlled",
      description:
        "Finance process standardisation, data clean-ups, ERP fitment/rollout, FPA as a service",
      problems: [
        "Basic dashboards without real-time data",
        "Patchwork systems operating in silos",
        "Mostly manual work with basic ERP accounting",
        "Consistent processes but not linked to best practices",
      ],
      solutions: [
        "Standardize finance processes across organization",
        "Conduct comprehensive data clean-up",
        "Assess and implement proper ERP fitment",
        "Provide FPA (Financial Planning & Analysis) as a service",
      ],
    },
    3: {
      title: "Stage 3",
      subtitle: "Automated & Integrated",
      description:
        "Full ERP implementation, automation scripts, RPA, reporting automation",
      problems: [
        "Real-time data flows between spreadsheets need optimization",
        "Sophisticated ERP but lacks integrations",
        "Core finance on ERP but reconciliations done outside",
        "Best practices adopted but adherence uncertain",
      ],
      solutions: [
        "Implement full ERP system integration",
        "Deploy automation scripts for routine tasks",
        "Introduce RPA (Robotic Process Automation)",
        "Automate reporting processes completely",
      ],
    },
    4: {
      title: "Stage 4",
      subtitle: "Data-Driven & Predictive",
      description:
        "FPA as a service, CFO support, predictive analytics automation",
      problems: [
        "Dynamic MIS and macros need enhancement",
        "Highly automated but integration gaps exist",
        "Completely automated but scope for improvement",
        "Documented best practices need better adherence monitoring",
      ],
      solutions: [
        "Enhance FPA services with advanced analytics",
        "Provide CFO support and strategic guidance",
        "Implement predictive analytics automation",
        "Deploy advanced business intelligence tools",
      ],
    },
    5: {
      title: "Stage 5",
      subtitle: "Strategic & Scalable",
      description:
        "Technical Acc, Outsourcing, IFRS/US GAAP advisory, legacy ERP overhaul",
      problems: [
        "Predictive analysis capabilities need refinement",
        "Only financial statement preparation remains manual",
        "Investment-ready processes need global alignment",
        "IFC/ICFR controls need continuous improvement",
      ],
      solutions: [
        "Provide technical accounting expertise",
        "Offer comprehensive finance outsourcing",
        "Implement IFRS/US GAAP advisory services",
        "Overhaul legacy ERP systems for global standards",
      ],
    },
  };
  return stageDetails[stage as keyof typeof stageDetails] || stageDetails[1];
};

const Index = () => {
  const [currentStage, setCurrentStage] = useState<
    "intro" | "questionnaire" | "personal-details" | "results"
  >("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: "",
    companyName: "",
    phoneNumber: "",
  });
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string[]>
  >({});
  const [identifiedProblems, setIdentifiedProblems] = useState<string[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    reaction: "",
    message: "",
  });
  const [showTopNotification, setShowTopNotification] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showFirework, setShowFirework] = useState(false);
  const [latestFeedback, setLatestFeedback] = useState<Feedback | null>(null);
  const [emojiFireworks, setEmojiFireworks] = useState<string[]>([]);
  const [stage, setStage] = useState<number>(1); // <-- add this state
  const [stageDetails, setStageDetails] = useState<StageDetails>(
    getStageDetails(1)
  );

  // API hook for form submission
  const financialAssessmentMutation = useFinancialAssessmentSubmission();
  const reviewSubmissionMutation = useReviewSubmission();

  // Store respondent ID for review submission
  const [respondentId, setRespondentId] = useState<string | null>(null);

  // Load feedback from localStorage on component mount
  useEffect(() => {
    const savedFeedback = localStorage.getItem("finance-assessment-feedback");
    if (savedFeedback) {
      const feedback = JSON.parse(savedFeedback);
      setFeedbackList(feedback);
      if (feedback.length > 0) {
        setLatestFeedback(feedback[feedback.length - 1]);
      }
    }
  }, []);

  // Custom notification system for top-right
  const showNotification = (title: string, message: string) => {
    setShowTopNotification({ title, message });
    setTimeout(() => setShowTopNotification(null), 1000);
  };

  const handleGetStarted = () => {
    setCurrentStage("questionnaire");
    showNotification(
      "🕴️ Mission Accepted!",
      "Welcome to the heist, mastermind. Let's assemble your crew and plan the perfect strategy!"
    );
  };

  const handleAnswerSelect = (
    questionId: string,
    optionId: string,
    problem: string
  ) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      const isSelected = current.includes(optionId);

      if (question.multiSelect) {
        if (isSelected) {
          return {
            ...prev,
            [questionId]: current.filter((id) => id !== optionId),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...current, optionId],
          };
        }
      } else {
        return {
          ...prev,
          [questionId]: [optionId],
        };
      }
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      showNotification(
        "🎯 Phase Complete!",
        `Moving to phase ${currentQuestion + 2} of ${questions.length}`
      );
    } else {
      // Check if at least one option is selected across all questions before proceeding
      const hasSelectedOptions = Object.keys(selectedAnswers).some(
        (questionId) =>
          selectedAnswers[questionId] && selectedAnswers[questionId].length > 0
      );

      if (!hasSelectedOptions) {
        showNotification(
          "Mission Planning Required",
          "Please select at least one option from any question to proceed with your mission brief."
        );
        return;
      }

      // Compile problems and move to personal details
      const problems: string[] = [];
      Object.entries(selectedAnswers).forEach(([questionId, optionIds]) => {
        const question = questions.find((q) => q.id === questionId);
        optionIds.forEach((optionId) => {
          const option = question?.options.find((o) => o.id === optionId);
          if (option) {
            problems.push(option.problem);
          }
        });
      });
      // Remove duplicates by converting to Set and back to array
      const uniqueProblems = [...new Set(problems)];
      console.log("All problems found:", problems);
      console.log("Unique problems after deduplication:", uniqueProblems);
      console.log("Unique problems length:", uniqueProblems.length);
      setIdentifiedProblems(uniqueProblems);
      setCurrentStage("personal-details");
    }
  };

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      showNotification(
        "⏭️ Skipped Phase",
        "Moving to the next phase of your heist plan."
      );
    } else {
      // Check if at least one option is selected across all questions before proceeding
      const hasSelectedOptions = Object.keys(selectedAnswers).some(
        (questionId) =>
          selectedAnswers[questionId] && selectedAnswers[questionId].length > 0
      );

      if (!hasSelectedOptions) {
        showNotification(
          "Mission Planning Required",
          "Please select at least one option from any question to proceed with your mission brief."
        );
        return;
      }

      const problems: string[] = [];
      Object.entries(selectedAnswers).forEach(([questionId, optionIds]) => {
        const question = questions.find((q) => q.id === questionId);
        optionIds.forEach((optionId) => {
          const option = question?.options.find((o) => o.id === optionId);
          if (option) {
            problems.push(option.problem);
          }
        });
      });
      // Remove duplicates by converting to Set and back to array
      const uniqueProblems = [...new Set(problems)];
      setIdentifiedProblems(uniqueProblems);
      setCurrentStage("personal-details");
    }
  };

  const handlePersonalDetailsSubmit = async () => {
    if (!personalDetails.fullName || !personalDetails.companyName) {
      showNotification(
        "Intel Required",
        "Full Name and Company Name are required to complete the mission brief."
      );
      return;
    }

    // Check if at least one option is selected across all questions
    const hasSelectedOptions = Object.keys(selectedAnswers).some(
      (questionId) =>
        selectedAnswers[questionId] && selectedAnswers[questionId].length > 0
    );

    if (!hasSelectedOptions) {
      showNotification(
        "Mission Planning Required",
        "Please select at least one option from the questionnaire to proceed with your mission brief."
      );
      return;
    }

    try {
      // Transform selectedAnswers to include full question and answer details
      const questionsWithResponses = Object.entries(selectedAnswers)
        .map(([questionId, optionIds]) => {
          const question = questions.find((q) => q.id === questionId);
          if (!question) return null;

          const selectedOptions = optionIds
            .map((optionId) => {
              const option = question.options.find((o) => o.id === optionId);
              return option
                ? {
                    id: optionId,
                    text: option.text,
                    description: option.description,
                    problem: option.problem,
                  }
                : null;
            })
            .filter(Boolean);

          return {
            questionId,
            questionText: question.text,
            questionDescription: question.description,
            multiSelect: question.multiSelect,
            selectedOptions,
          };
        })
        .filter(Boolean);

      // Submit the form data to your backend
      const result = await financialAssessmentMutation.mutateAsync({
        fullName: personalDetails.fullName,
        companyName: personalDetails.companyName,
        phoneNumber: personalDetails.phoneNumber,
        selectedAnswers: selectedAnswers, // Keep original for compatibility
        questionsWithResponses: questionsWithResponses, // Add detailed responses
        identifiedProblems: identifiedProblems,
      });

      console.log("Form submitted successfully:", result);

      // Extract respondent ID from the response to use for review submission
      if (result.data && result.data.length > 0) {
        const submissionData = result.data[0];
        console.log("Submission data:", submissionData);

        // Check if respondentId is directly available in the response
        if (submissionData.respondentId) {
          setRespondentId(submissionData.respondentId);
          console.log(
            "Respondent ID extracted from response:",
            submissionData.respondentId
          );
        } else {
          console.error(
            "Could not extract respondent ID from response:",
            submissionData
          );
          console.error(
            "Available fields in response:",
            Object.keys(submissionData)
          );
        }
      } else {
        console.error("No data in API response:", result);
      }

      showNotification(
        "🎯 Mission Brief Generated!",
        "Your data has been saved successfully!"
      );

      // Calculate stage and set stage details for results
      const calculatedStage = calculateStage(selectedAnswers);
      setStage(calculatedStage);
      setStageDetails(getStageDetails(calculatedStage));
      // Move to results stage
      setCurrentStage("results");
    } catch (error) {
      console.error("Form submission failed:", error);
      showNotification(
        "❌ Submission Failed",
        "Please try again or contact support."
      );
    }
  };

  const handleReattempt = () => {
    // Reset all state
    setCurrentStage("intro");
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setIdentifiedProblems([]);
    setPersonalDetails({
      fullName: "",
      companyName: "",
      phoneNumber: "",
    });
    setRespondentId(null);
    showNotification("🔄 Mission Reset", "Starting fresh mission planning!");
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Removed profile photo upload functionality
  };

  const handleCameraCapture = () => {
    // Removed camera capture functionality
  };

  const triggerEmojiFirework = (emoji: string) => {
    const newFirework = getEmojiForReaction(emoji);
    setEmojiFireworks((prev) => [...prev, newFirework]);
    setTimeout(() => {
      setEmojiFireworks((prev) => prev.slice(1));
    }, 2000);
  };

  const handleFeedbackSubmit = async () => {
    console.log("Feedback submission started", {
      rating: feedbackData.rating,
      respondentId: respondentId,
      personalDetails: personalDetails,
    });

    if (feedbackData.rating === 0) {
      showNotification(
        "Rating Required",
        "Please provide a rating for the assessment."
      );
      return;
    }

    if (!respondentId) {
      console.error("No respondent ID available for review submission");
      showNotification(
        "Error",
        "Unable to submit review. Please complete the assessment first."
      );
      return;
    }

    try {
      console.log("Submitting review with data:", {
        respondentId: respondentId,
        rating: feedbackData.rating,
        reaction: feedbackData.reaction,
        feedback: feedbackData.message,
      });

      // Submit review to API
      const result = await reviewSubmissionMutation.mutateAsync({
        respondentId: respondentId,
        rating: feedbackData.rating,
        reaction: feedbackData.reaction,
        feedback: feedbackData.message,
      });

      console.log("Review submission result:", result);

      // Also save to localStorage for UI feedback display
      const feedback: Feedback = {
        id: Date.now().toString(),
        name: personalDetails.fullName,
        rating: feedbackData.rating,
        reaction: feedbackData.reaction,
        message: feedbackData.message,
        timestamp: Date.now(),
      };

      const updatedFeedback = [...feedbackList, feedback];
      setFeedbackList(updatedFeedback);
      setLatestFeedback(feedback);
      localStorage.setItem(
        "finance-assessment-feedback",
        JSON.stringify(updatedFeedback)
      );

      // Trigger emoji firework
      if (feedbackData.reaction) {
        triggerEmojiFirework(feedbackData.reaction);
      }

      // Trigger general firework effect
      setShowFirework(true);
      setTimeout(() => setShowFirework(false), 2000);

      setFeedbackData({ rating: 0, reaction: "", message: "" });
      setShowFeedbackModal(false);
      showNotification(
        "Thank you!",
        "Your feedback has been submitted successfully."
      );
    } catch (error) {
      console.error("Failed to submit review:", error);
      showNotification("Error", "Failed to submit review. Please try again.");
    }
  };

  const getProgress = () => {
    const totalSteps = questions.length + 1;
    let currentStep = 0;
    if (currentStage === "questionnaire") currentStep = currentQuestion + 1;
    if (currentStage === "personal-details") currentStep = questions.length + 1;
    if (currentStage === "results") currentStep = totalSteps;
    return (currentStep / totalSteps) * 100;
  };

  const getEmojiForReaction = (reaction: string) => {
    switch (reaction) {
      case "Great":
        return "😊";
      case "Loved it":
        return "❤️";
      case "Excellent":
        return "🔥";
      case "Amazing":
        return "⚡";
      default:
        return "😊";
    }
  };

  if (currentStage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Matrix-like falling code effect */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs font-mono animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {Math.random().toString(36).substring(2, 15)}
            </div>
          ))}
        </div>

        {/* Emoji Fireworks */}
        {emojiFireworks.map((emoji, index) => (
          <div
            key={index}
            className="fixed top-20 right-20 z-50 text-6xl animate-bounce pointer-events-none"
            style={{
              animation: "bounce 0.5s ease-out, fade-out 2s ease-out",
              animationFillMode: "forwards",
            }}
          >
            {emoji}
            <div className="absolute inset-0 animate-ping">{emoji}</div>
          </div>
        ))}

        {/* Latest Feedback Display - Enhanced */}
        {latestFeedback && (
          <div className=" hidden lg:block fixed bottom-6 right-6 z-50 animate-fade-in">
            <Card className="bg-gradient-to-br from-purple-800/95 to-blue-800/95 text-white shadow-2xl border-2 border-purple-400/50 backdrop-blur-sm max-w-sm">
              <CardContent className="p-6">
                <div className=" flex items-start space-x-4">
                  {/* Profile Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center border-2 border-purple-300/50">
                      <span className="text-lg font-bold">
                        {latestFeedback.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-3xl animate-bounce">
                        {getEmojiForReaction(latestFeedback.reaction)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-purple-100">
                          Latest Review
                        </h4>
                        <p className="text-xs text-purple-200 truncate">
                          {latestFeedback.name} - {latestFeedback.reaction}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < latestFeedback.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-purple-200 ml-2">
                        ({latestFeedback.rating}/5)
                      </span>
                    </div>

                    {latestFeedback.message && (
                      <p className="text-xs text-purple-200 italic line-clamp-2">
                        "{latestFeedback.message}"
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Firework Effect */}
        {showFirework && (
          <div className="fixed inset-0 z-40 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 text-6xl animate-ping">
              🎉
            </div>
            <div
              className="absolute top-1/3 right-1/4 text-6xl animate-ping"
              style={{ animationDelay: "0.2s" }}
            >
              ✨
            </div>
            <div
              className="absolute bottom-1/3 left-1/3 text-6xl animate-ping"
              style={{ animationDelay: "0.4s" }}
            >
              🎊
            </div>
            <div
              className="absolute bottom-1/4 right-1/3 text-6xl animate-ping"
              style={{ animationDelay: "0.6s" }}
            >
              💫
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-800/80 to-blue-800/80 backdrop-blur-sm text-purple-100 px-6 py-3 rounded-full text-sm font-medium border border-purple-500/30 shadow-lg animate-fade-in">
              <Trophy className="w-5 h-5 animate-bounce" />
              <span>🎮 The 5-Level Finance Maturity Arch</span>
            </div>

            <h1
              className="text-[35px] md:text-6xl font-bold text-white leading-tight animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Diagnose | Decode | &nbsp;
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent animate-pulse">
                Transform
              </span>
            </h1>

            <p
              className="text-xl text-purple-200 leading-relaxed max-w-3xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              🚀 Know exactly where your business stands and what needs fixing,
              in minutes.
            </p>
          </div>

          <div
            className="grid md:grid-cols-4 gap-6 mt-16 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <Card className="border-2 border-purple-500/30 bg-slate-800/50 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20 transform hover:scale-105 group">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:animate-bounce">
                  <RefreshCwOff className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-sm text-white">
                  Disconnected Systems
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-purple-300 text-xs">
                  Are you stuck juggling disconnected systems across teams?
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500/30 bg-slate-800/50 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/20 transform hover:scale-105 group">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:animate-bounce">
                  <KeyboardOff className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-sm text-white">
                  Manual Work
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-blue-300 text-xs">
                  Is excessive manual work holding back execution speed?
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/30 bg-slate-800/50 backdrop-blur-sm hover:border-green-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/20 transform hover:scale-105 group">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:animate-bounce">
                  <FolderSync className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-sm text-white">
                  Real-time data
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-green-300 text-xs">
                  Are you making key decisions without reliable, real-time data?
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-500/30 bg-slate-800/50 backdrop-blur-sm hover:border-orange-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/20 transform hover:scale-105 group">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:animate-bounce">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-sm text-white">
                  Investor Ready
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-orange-300 text-xs">
                  Is your organization investor-ready or simply operational?
                </p>
              </CardContent>
            </Card>
          </div>

          <div
            className="pt-12 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-slate-700 via-purple-700 to-slate-800 hover:from-slate-600 hover:via-purple-600 hover:to-slate-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-110 border border-purple-400/30 backdrop-blur-sm relative overflow-hidden group"
              style={{
                animation: "pulse 4s ease-in-out infinite",
                boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              🎯 Let's Find the Bottlenecks
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStage === "questionnaire") {
    const question = questions[currentQuestion];
    const progress = getProgress();

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Top notification */}
        {showTopNotification && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <Card className="bg-gradient-to-r from-purple-800 to-blue-800 text-white shadow-2xl border-purple-500/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="font-bold text-sm">
                  {showTopNotification.title}
                </h4>
                <p className="text-xs opacity-90">
                  {showTopNotification.message}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto py-8 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-800/80 to-blue-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 border border-purple-500/30">
                <Eye className="w-4 h-4 text-purple-300" />
                <span className="text-purple-100">
                  🕴️ We don’t just diagnose we fix it.
                </span>
              </div>
              <h1 className=" text-[20px] md:text-[40px] font-bold text-white mb-2 leading-[1.2em]">
              In just a minute, <span className=" text-[28px] font-bold text-white mb-2">
              we’ll pinpoint where your business stands and how our ERP, Automation, FP&A, and CFO Back Office can unlock your next level.
              </span >
              </h1>
              
              <p className="text-[18px]  text-purple-200">
                Faster ERP. Sharper dashboards. Smoother processes. Smarter
                decisions.
              </p>
            </div>

            {/* Progress bar only */}
            <div className="w-full bg-slate-700/50 rounded-full h-4 relative overflow-hidden backdrop-blur-sm border border-slate-600/30">
              <div
                className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>

          <Card className="shadow-2xl border-0 relative overflow-hidden bg-slate-800/90 backdrop-blur-lg text-white border-purple-500/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-white leading-tight flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                {question.text}
              </CardTitle>
              <CardDescription className="text-base text-purple-200">
                {question.description}{" "}
                {question.multiSelect && "🎯 Select all that apply"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {question.options.map((option) => {
                const isSelected =
                  selectedAnswers[question.id]?.includes(option.id) || false;
                const IconComponent = option.icon;

                return (
                  <div
                    key={option.id}
                    onClick={() =>
                      handleAnswerSelect(question.id, option.id, option.problem)
                    }
                    className={` p-3 md:p-6 rounded-xl border-2 cursor-pointer transition-all duration-500 hover:shadow-lg transform hover:scale-[1.02] group ${
                      isSelected
                        ? "border-purple-400 bg-gradient-to-r from-purple-800/70 to-blue-800/70 shadow-lg shadow-purple-500/20"
                        : "border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div
                          className={`hidden md:flex w-12 h-12 md:w-16 md:h-16 rounded-xl  items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg"
                              : "bg-slate-700 group-hover:bg-slate-600"
                          }`}
                        >
                          <IconComponent
                            className={` w-6 md:w-8 h-6 md:h-8 ${
                              isSelected ? "text-white" : "text-slate-300"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div
                            className={` text-[16px] md:text-xl font-bold mb-1 ${
                              isSelected ? "text-purple-100" : "text-slate-200"
                            }`}
                          >
                            {option.text}
                          </div>
                          <div
                            className={`text-sm ${
                              isSelected ? "text-purple-200" : "text-slate-400"
                            }`}
                          >
                            {option.description}
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? "border-purple-400 bg-purple-500 scale-110"
                              : "border-slate-500 hover:border-slate-400"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="  md:flex-row flex-col flex gap-3 md:gap-0 justify-between mt-8">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestion === 0}
              className="px-8 py-3 bg-slate-800/80 text-white border-slate-600 hover:bg-slate-700 backdrop-blur-sm disabled:opacity-50"
            >
              ← Previous Phase
            </Button>

            <div className=" flex-col gap-3 md:gap-0 md:flex-row flex space-x-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="px-8 py-3 text-slate-300 hover:text-white bg-slate-800/80 border-slate-600 hover:bg-slate-700 backdrop-blur-sm"
              >
                ⏭️ Skip Phase
              </Button>
              <Button
              
                onClick={handleNext}
                className="  bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentQuestion === questions.length - 1
                  ? "🎯 Complete Mission Planning"
                  : "Next Phase"}
                <ArrowRight className="ml-2  w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStage === "personal-details") {
    // Calculate answered questions for display
    const answeredQuestions = Object.keys(selectedAnswers).filter(
      (questionId) =>
        selectedAnswers[questionId] && selectedAnswers[questionId].length > 0
    ).length;
    const totalQuestions = questions.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Top notification */}
        {showTopNotification && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <Card className="bg-gradient-to-r from-purple-800 to-blue-800 text-white shadow-2xl border-purple-500/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="font-bold text-sm">
                  {showTopNotification.title}
                </h4>
                <p className="text-xs opacity-90">
                  {showTopNotification.message}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="max-w-2xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-800/80 to-blue-800/80 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-500/30">
              <PartyPopper className="w-6 h-6 text-purple-300" />
              <span className="text-lg font-bold text-purple-100">
                🎯 The 5-Level Finance Maturity Arch
              </span>
            </div>
            {/* Progress indicator */}
            <div className="mt-4 mb-6">
              <div className="bg-slate-800/50 rounded-full px-4 py-2 inline-block border border-slate-600/30">
                <span className="text-sm text-purple-200">
                  📊 Questions Answered:{" "}
                  <span className="font-bold text-purple-100">
                    {answeredQuestions}
                  </span>
                  /{totalQuestions}
                </span>
              </div>
            </div>
          </div>

          <Card className="shadow-2xl border-0 relative overflow-hidden bg-slate-800/90 backdrop-blur-lg border-purple-500/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
            <CardHeader className="pb-6 text-center">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center">
                <PartyPopper className="w-6 h-6 mr-2 text-purple-400" />
                Almost done!
              </CardTitle>
              <CardDescription className="text-base text-purple-200">
                🏆 Share your details to unlock your personalized diagnostic
                report,
                <br /> tailored for your business.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-purple-200"
                >
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={personalDetails.fullName}
                  onChange={(e) =>
                    setPersonalDetails((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                  className="h-12 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 backdrop-blur-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-purple-200"
                >
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={personalDetails.phoneNumber}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                    setPersonalDetails((prev) => ({
                      ...prev,
                      phoneNumber: onlyNums,
                    }));
                  }}
                  placeholder="Enter your phone number"
                  className="h-12 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 backdrop-blur-sm"
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="companyName"
                  className="text-sm font-medium text-purple-200"
                >
                  Company Name *
                </Label>
                <Input
                  id="companyName"
                  value={personalDetails.companyName}
                  onChange={(e) =>
                    setPersonalDetails((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  placeholder="Enter your company name"
                  className="h-12 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 backdrop-blur-sm"
                  required
                />
              </div>
              
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handlePersonalDetailsSubmit}
              disabled={financialAssessmentMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {financialAssessmentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  🚀 Generate Mission Brief
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStage === "results") {
    // Use stageDetails for display
    const stageSolutions = stageDetails.solutions.map(
      (solution: string, index: number) => ({
        problem: stageDetails.problems[index] || `Challenge ${index + 1}`,
        icon: Target,
        solution: solution,
        heistDescription: `Strategic implementation for ${stageDetails.subtitle.toLowerCase()}.`,
      })
    );
    const solutionsToShow = stageSolutions;

    // Stage-specific CTAs
    const stageCtaContent: Record<number, { heading: string; paragraph: string }> = {
      1: {
        heading: "You’ve built your business on grit. Now it’s time to build it on systems.",
        paragraph:
          "You’ve come this far despite fragmented processes, imagine the growth if the basics were streamlined.",
      },
      2: {
        heading: "You’ve built consistency now, it’s time to build momentum.",
        paragraph:
          "Your foundations are in place, but growth gets stuck without integration. There’s an easier, faster way to scale without burning out your teams. Let’s talk about how you can evolve from stable to scalable.",
      },
      3: {
        heading: "You’re running steady, the next leap is strategic speed.",
        paragraph:
          "You’ve achieved operational flow, but there’s untapped value in sharper insights and faster decisions. Let’s explore how you can shift your team’s energy from operational firefighting to strategic growth.",
      },
      4: {
        heading: "You’ve unlocked the power of data, are you using it to lead?",
        paragraph:
          "With dashboards and predictive tools running, the next level is sharper decision-making and cross-functional alignment. Let’s discuss how your leadership team can harness this ecosystem for competitive advantage.",
      },
      5: {
        heading: "Your house is in order now it’s time to build your legacy.",
        paragraph:
          "Your organization is structured, investor-ready, and future-proofed. The conversation now is about scaling impact, new markets, sharper agility, and long-term resilience. Let’s talk about shaping a finance and systems roadmap worthy of your ambitions.",
      },
    };
    const cta = stageCtaContent[stage] || stageCtaContent[1];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Top notification */}
        {showTopNotification && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <Card className="bg-gradient-to-r from-purple-800 to-blue-800 text-white shadow-2xl border-purple-500/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="font-bold text-sm">
                  {showTopNotification.title}
                </h4>
                <p className="text-xs opacity-90">
                  {showTopNotification.message}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Feedback Modal with Profile Photo Upload */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">
                      Share Your Experience
                    </CardTitle>
                    <CardDescription>
                      Help us improve our assessment for future users
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-3 block">
                    How would you rate this assessment?
                  </Label>
                  <div className="flex space-x-2 justify-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          setFeedbackData((prev) => ({ ...prev, rating }))
                        }
                        className={`w-12 h-12 rounded-full transition-all duration-200 ${
                          feedbackData.rating >= rating
                            ? "text-yellow-400 scale-110"
                            : "text-slate-300 hover:text-yellow-300"
                        }`}
                      >
                        <Star
                          className="w-10 h-10"
                          fill={
                            feedbackData.rating >= rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-3 block">
                    Quick reaction
                  </Label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { emoji: "😊", label: "Great", icon: ThumbsUp },
                      { emoji: "❤️", label: "Loved it", icon: Heart },
                      { emoji: "🔥", label: "Excellent", icon: Flame },
                      { emoji: "⚡", label: "Amazing", icon: Zap },
                    ].map((reaction) => (
                      <button
                        key={reaction.label}
                        onClick={() =>
                          setFeedbackData((prev) => ({
                            ...prev,
                            reaction: reaction.label,
                          }))
                        }
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 transform ${
                          feedbackData.reaction === reaction.label
                            ? "border-purple-500 bg-purple-50 scale-105"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            feedbackData.reaction === reaction.label
                              ? "scale(1.05)"
                              : "scale(1)";
                        }}
                      >
                        <div className="text-2xl mb-1">{reaction.emoji}</div>
                        <div className="text-xs text flex justify-center items-center text-slate-600">
                          {reaction.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="feedback-message"
                    className="text-sm font-medium text-slate-700"
                  >
                    Additional feedback (optional)
                  </Label>
                  <Textarea
                    id="feedback-message"
                    value={feedbackData.message}
                    onChange={(e) =>
                      setFeedbackData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="What did you like most? How can we improve?"
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-6"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={handleFeedbackSubmit}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6"
                  >
                    Submit Feedback
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <div className="max-w-6xl mx-auto py-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm px-8 py-4 rounded-full mb-6 border border-yellow-500/30">
              {/* <Trophy className="w-8 h-8 text-yellow-400" /> */}
              <span className=" text-[20px] md:text-2xl font-bold text-yellow-300">
                🏆 {stageDetails.title}: {stageDetails.subtitle}
              </span>
            </div>
            <p
              className=" text-[16px] md:text-xl text-purple-200 max-w-3xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Congratulations, {personalDetails.fullName}! Based on your
              responses, {personalDetails.companyName} is at{" "}
              {stageDetails.title}.
            </p>

            {/* Symptoms Section: Show all selected options */}
            <div className="mt-10 mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-2xl font-bold text-pink-300 mb-4 text-center">Symptoms</h3>
              <ul className="max-w-2xl mx-auto bg-slate-800/70 rounded-xl p-6 border border-pink-400/30 shadow-lg space-y-3">
                {Object.entries(selectedAnswers).flatMap(([questionId, optionIds]) => {
                  const question = questions.find(q => q.id === questionId);
                  if (!question) return [];
                  return optionIds.map(optionId => {
                    const option = question.options.find(o => o.id === optionId);
                    return option ? (
                      <li key={`${questionId}-${optionId}`} className="text-lg text-left text-pink-100 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                        {option.text}
                      </li>
                    ) : null;
                  });
                })}
              </ul>
            </div>
          </div>
          {/* Strategic Solutions or Congratulations */}
          <div
            className="space-y-6 mb-12 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Card className="shadow-xl relative overflow-hidden bg-gradient-to-br from-slate-800/90 to-purple-900/90 backdrop-blur-lg text-white border-2 border-purple-600/50 max-w-4xl mx-auto">
              {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div> */}
              {/* <CardHeader className="pb-4 text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="p-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-lg">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {stageDetails.title}: {stageDetails.subtitle}
                </CardTitle>
                <Badge variant="outline" className="text-purple-200 border-purple-400 bg-purple-800/50">
                  {stageDetails.description}
                </Badge>
              </CardHeader> */}
              {/* <CardContent className="text-center">
                <div className="space-y-6">
                  <div className="text-2xl font-bold text-white mb-2">
                    {stageDetails.title}: {stageDetails.subtitle}
                  </div>
                  <div className="text-lg text-purple-200 mb-2">
                    {stageDetails.description}
                  </div>
                </div>
              </CardContent> */}
            </Card>
          </div>
          {/* Call to Action */}
          <div
            className="text-center animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-800/80 to-blue-800/80 backdrop-blur-lg border-2 border-purple-500/50 shadow-2xl">
              <CardContent className="p-4 md:p-8">
                <h3 className=" text-[20px] md:text-3xl font-bold text-white mb-4">
                  {cta.heading}
                </h3>
                <p className=" text-[16px] md:text-xl text-purple-200 mb-8">
                  {cta.paragraph}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={handleReattempt}
                    variant="outline"
                    className="bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-500 hover:from-slate-600 hover:to-slate-700 hover:border-slate-400 backdrop-blur-sm px-6 py-3 transition-all duration-300"
                  >
                    <Flame className="mr-2 w-4 h-4" />
                    Reattempt Mission
                  </Button>
                  <Button
                    onClick={() => setShowFeedbackModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 transition-all duration-300"
                  >
                    <Flame className="mr-2 w-4 h-4" />
                    Share Feedback
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(
                        "https://calendly.com/contetrapvtlimited/30min?month=2023-12",
                        "_blank"
                      )
                    }
                    className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-8 py-3 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-emerald-400/30 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Calendar className="mr-3 w-5 h-5" />
                    Schedule Consultation
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-6">
                  {/* Stage-specific callout message */}
                  {(() => {
                    const stageCallout: Record<number, string> = {
                      1: 'Stage 1 - Diagnostic reviews, quick-win automations, books clean-up, MIS services',
                      2: 'Stage 2 - Finance process standardisation, data clean-ups, ERP fitment/rollout, FPA as a service',
                      3: 'Stage 3 - Full ERP implementation, automation scripts, RPA, reporting automation, FPA as a service',
                      4: 'Stage 4 - FPA as a service, CFO support, predictive analytics, Automation, Diagnostic Reviews',
                      5: 'Stage 5 - Technical Accounting outsourcing, IFRS/US GAAP advisory, Legacy ERP Overhaul',
                    };
                    return (
                      <p className=" text-[16px] md:text-lg text-purple-300">
                        {stageCallout[stage] || stageCallout[1]}
                      </p>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Add the Offered Services block at the very bottom of the results page, after the CTA and before the closing tags */}
          <div className="mt-10 mb-12 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <h3 className="text-2xl font-bold text-emerald-300 mb-4 text-center">Our Offered Services</h3>
            <ul className="max-w-2xl mx-auto bg-slate-800/70 rounded-xl p-6 border border-emerald-400/30 shadow-lg text-lg text-left text-emerald-100 flex flex-col gap-2 justify-center">
              {stageDetails.description.split(',').map((item, idx) => {
                // Capitalize first letter of each word
                const capitalized = item.trim().replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                    {capitalized}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
