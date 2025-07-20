import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ArrowRight, TrendingUp, Shield, Calculator, Target, Users, Upload, X, Camera, Trophy, Flame, PartyPopper, Eye, ThumbsUp, Heart, Zap, Calendar, ExternalLink, Star, BarChart3 } from "lucide-react";

interface PersonalDetails {
  fullName: string;
  designation: string;
  companyName: string;
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
  profilePhoto?: string;
}

const questions: Question[] = [
  {
    id: "excel-situation",
    text: "How chaotic (or smooth) is your Excel situation?",
    description: "Be Honest",
    multiSelect: false,
    options: [
      { 
        id: "1", 
        text: "Disjointed Excel", 
        description: "scattered spreadsheets with no connection",
        problem: "Excel Data Management Issues",
        icon: Calculator
      },
      { 
        id: "2", 
        text: "Very basic dashboards", 
        description: "simple reporting tools",
        problem: "Basic Reporting Limitations",
        icon: BarChart3
      },
      { 
        id: "3", 
        text: "Real-time data flows between spreadsheets", 
        description: "connected but manual processes",
        problem: "Manual Data Integration",
        icon: TrendingUp
      },
      { 
        id: "4", 
        text: "Dynamic MIS and macros", 
        description: "automated reporting systems",
        problem: "Advanced Excel Dependencies",
        icon: Target
      },
      { 
        id: "5", 
        text: "Predictive Analysis", 
        description: "forecasting and trend analysis",
        problem: "Advanced Analytics Needs",
        icon: TrendingUp
      }
    ]
  },
  {
    id: "erp-journey",
    text: "Where does your ERP journey stand today?",
    description: "ERP Reality Check",
    multiSelect: false,
    options: [
      { 
        id: "1", 
        text: "Accounting is on Tally, no other major tools", 
        description: "basic accounting software only",
        problem: "Limited ERP Infrastructure",
        icon: Calculator
      },
      { 
        id: "2", 
        text: "Patchwork ERP/Systems in silo", 
        description: "disconnected systems",
        problem: "System Integration Challenges",
        icon: Shield
      },
      { 
        id: "3", 
        text: "Sophisticated ERP system but no integrations", 
        description: "advanced but isolated",
        problem: "ERP Integration Gaps",
        icon: Eye
      },
      { 
        id: "4", 
        text: "Highly automated integrations and ERP system", 
        description: "connected and automated",
        problem: "Optimization Opportunities",
        icon: Target
      },
      { 
        id: "5", 
        text: "Only Financial Statement preparation is manual (Everything else is automated within the ERP/outside the ERP)", 
        description: "near-complete automation",
        problem: "Final Process Automation",
        icon: Trophy
      }
    ]
  },
  {
    id: "manual-work",
    text: "How much is your finance team stuck in manual mode?",
    description: "Manual Work Misery",
    multiSelect: false,
    options: [
      { 
        id: "1", 
        text: "Excessive manual work", 
        description: "most processes are manual",
        problem: "High Manual Workload",
        icon: Shield
      },
      { 
        id: "2", 
        text: "Mostly manual work, but accounting is on ERP", 
        description: "basic automation in place",
        problem: "Limited Process Automation",
        icon: Calculator
      },
      { 
        id: "3", 
        text: "Core finance on ERP, reconciliations done outside the system", 
        description: "partial automation achieved",
        problem: "Reconciliation Process Gaps",
        icon: BarChart3
      },
      { 
        id: "4", 
        text: "Completely automated, but scope for improvement", 
        description: "high automation with optimization potential",
        problem: "Process Optimization Needs",
        icon: Target
      },
      { 
        id: "5", 
        text: "Investment-ready/global best practices adopted", 
        description: "world-class finance operations",
        problem: "Continuous Excellence Maintenance",
        icon: Trophy
      }
    ]
  },
  {
    id: "process-discipline",
    text: "How solid are your finance processes on paper?",
    description: "Process Discipline",
    multiSelect: false,
    options: [
      { 
        id: "1", 
        text: "No documented SOPs", 
        description: "processes exist but not documented",
        problem: "Process Documentation Gaps",
        icon: Shield
      },
      { 
        id: "2", 
        text: "Processes are consistent, but not linked to best practices", 
        description: "standardized but not optimized",
        problem: "Best Practice Implementation",
        icon: Eye
      },
      { 
        id: "3", 
        text: "Best practices adopted, not sure of adherence", 
        description: "good framework, uncertain execution",
        problem: "Process Adherence Monitoring",
        icon: BarChart3
      },
      { 
        id: "4", 
        text: "Documented and adopted best practices", 
        description: "well-documented and followed",
        problem: "Advanced Control Implementation",
        icon: Target
      },
      { 
        id: "5", 
        text: "IFC, ICFR and all ELCs (Entity Level Controls) in place", 
        description: "comprehensive control framework",
        problem: "Control Framework Optimization",
        icon: Trophy
      }
    ]
  }
];

const solutions: Solution[] = [
  { 
    problem: "Strategic Direction Gaps", 
    icon: Target, 
    solution: "Develop comprehensive strategic frameworks with clear direction and measurable objectives.",
    heistDescription: "Your Strategist will map out the perfect plan with precision targeting and clear escape routes."
  },
  { 
    problem: "Technology & Automation Needs", 
    icon: Calculator, 
    solution: "Implement cutting-edge automation systems and technical infrastructure optimization.",
    heistDescription: "The Hacker will infiltrate your systems and automate everything that slows you down."
  },
  { 
    problem: "Brand Identity Challenges", 
    icon: Eye, 
    solution: "Create cohesive brand identity systems with consistent visual and messaging frameworks.",
    heistDescription: "The Disguiser will craft the perfect brand identity that makes you unrecognizable to competitors."
  },
  { 
    problem: "Value Communication Issues", 
    icon: Target, 
    solution: "Develop clear value proposition frameworks and communication strategies.",
    heistDescription: "We'll make your value so clear, customers will be drawn to you like a magnet."
  },
  { 
    problem: "Brand Consistency Problems", 
    icon: Eye, 
    solution: "Establish comprehensive brand guidelines and consistency monitoring systems.",
    heistDescription: "Every touchpoint will perfectly disguise your true competitive advantage."
  },
  { 
    problem: "Revenue Volatility", 
    icon: TrendingUp, 
    solution: "Create predictable revenue systems with diversified income streams and optimization.",
    heistDescription: "We'll steal back your revenue predictability with foolproof systems."
  },
  { 
    problem: "Resource Allocation Issues", 
    icon: Shield, 
    solution: "Optimize resource allocation through priority frameworks and efficiency systems.",
    heistDescription: "Every resource will be deployed with surgical precision for maximum impact."
  },
  { 
    problem: "Strategic Clarity Gaps", 
    icon: Eye, 
    solution: "Provide comprehensive strategic clarity through structured planning and decision frameworks.",
    heistDescription: "Clear vision will be your greatest weapon in this mission."
  },
  { 
    problem: "Expert Consultation Requirements", 
    icon: Trophy, 
    solution: "Provide expert consultation and strategic guidance tailored to your specific challenges.",
    heistDescription: "Consider us your master planners for the perfect strategic heist."
  },
  { 
    problem: "Revenue Growth Objectives", 
    icon: TrendingUp, 
    solution: "Deploy revenue growth strategies with scalable systems and performance optimization.",
    heistDescription: "We'll steal market share and boost your revenue like professional thieves."
  },
  { 
    problem: "Brand Visibility Enhancement", 
    icon: Eye, 
    solution: "Amplify brand visibility through strategic positioning and market presence optimization.",
    heistDescription: "You'll be impossible to ignore while staying perfectly disguised from competitors."
  },
  { 
    problem: "Strategic Confidence Building", 
    icon: Target, 
    solution: "Build strategic confidence through data-driven insights and proven frameworks.",
    heistDescription: "You'll move with the confidence of a master thief who's planned the perfect heist."
  },
  { 
    problem: "Urgent Implementation Timeline", 
    icon: Flame, 
    solution: "Execute rapid implementation strategies with accelerated timelines and intensive support.",
    heistDescription: "We'll execute this heist at lightning speed - in and out before anyone knows what happened."
  },
  { 
    problem: "Short-term Implementation Goals", 
    icon: TrendingUp, 
    solution: "Deliver quick wins through focused short-term implementation with immediate impact.",
    heistDescription: "Your first successful heist will happen within 30 days."
  },
  { 
    problem: "Strategic Timeline Planning", 
    icon: Target, 
    solution: "Develop strategic timelines with phased implementation and milestone tracking.",
    heistDescription: "Every phase of your heist will be timed to perfection over the next 2-3 months."
  }
];

const defaultSolutions: Solution[] = [
  { 
    problem: "Strategic Foundation Building", 
    icon: Target, 
    solution: "Establish strong strategic foundations with comprehensive planning and clear objectives.",
    heistDescription: "Even master thieves need a solid plan - we'll help you build the perfect strategic foundation."
  },
  { 
    problem: "Brand Development Excellence", 
    icon: Eye, 
    solution: "Create compelling brand identity and consistent visual communication systems.",
    heistDescription: "Your brand will be so captivating, customers won't be able to resist your charm."
  },
  { 
    problem: "Growth Acceleration Strategy", 
    icon: TrendingUp, 
    solution: "Implement proven growth strategies and optimization systems for sustainable expansion.",
    heistDescription: "We'll help you steal the show and dominate your market with precision execution."
  }
];

const Index = () => {
  const [currentStage, setCurrentStage] = useState<'intro' | 'questionnaire' | 'personal-details' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({ fullName: '', designation: '', companyName: '' });
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [identifiedProblems, setIdentifiedProblems] = useState<string[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [feedbackData, setFeedbackData] = useState({ rating: 0, reaction: '', message: '', profilePhoto: '' });
  const [showTopNotification, setShowTopNotification] = useState<{ title: string; message: string } | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showFirework, setShowFirework] = useState(false);
  const [latestFeedback, setLatestFeedback] = useState<Feedback | null>(null);
  const [emojiFireworks, setEmojiFireworks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load feedback from localStorage on component mount
  useEffect(() => {
    const savedFeedback = localStorage.getItem('finance-assessment-feedback');
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
    setCurrentStage('questionnaire');
    showNotification("🕴️ Mission Accepted!", "Welcome to the heist, mastermind. Let's assemble your crew and plan the perfect strategy!");
  };

  const handleAnswerSelect = (questionId: string, optionId: string, problem: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    setSelectedAnswers(prev => {
      const current = prev[questionId] || [];
      const isSelected = current.includes(optionId);
      
      if (question.multiSelect) {
        if (isSelected) {
          return {
            ...prev,
            [questionId]: current.filter(id => id !== optionId)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...current, optionId]
          };
        }
      } else {
        return {
          ...prev,
          [questionId]: [optionId]
        };
      }
    });
  };

  const calculateStage = () => {
    // Convert selected answer IDs to numbers (1-5) and calculate average
    const values: number[] = [];
    Object.entries(selectedAnswers).forEach(([questionId, optionIds]) => {
      optionIds.forEach(optionId => {
        values.push(parseInt(optionId));
      });
    });
    
    if (values.length === 0) return 1;
    
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.round(average);
  };

  const getStageDetails = (stage: number) => {
    const stageDetails = {
      1: {
        title: "Stage 1",
        subtitle: "Manual & Fragmented",
        description: "Diagnostic reviews, quick-win automations, books clean-up, MIS services",
        problems: [
          "Heavy reliance on manual Excel processes",
          "Basic accounting system with limited integration", 
          "Excessive manual work in finance operations",
          "No documented standard operating procedures"
        ],
        solutions: [
          "Conduct diagnostic review of current processes",
          "Implement quick-win automation solutions",
          "Clean up and organize financial books", 
          "Establish basic MIS reporting services"
        ]
      },
      2: {
        title: "Stage 2",
        subtitle: "Standardised & Controlled",
        description: "Finance process standardisation, data clean-ups, ERP fitment/rollout, FPA as a service",
        problems: [
          "Basic dashboards without real-time data",
          "Patchwork systems operating in silos",
          "Mostly manual work with basic ERP accounting", 
          "Consistent processes but not linked to best practices"
        ],
        solutions: [
          "Standardize finance processes across organization",
          "Conduct comprehensive data clean-up",
          "Assess and implement proper ERP fitment",
          "Provide FPA (Financial Planning & Analysis) as a service"
        ]
      },
      3: {
        title: "Stage 3", 
        subtitle: "Automated & Integrated",
        description: "Full ERP implementation, automation scripts, RPA, reporting automation",
        problems: [
          "Real-time data flows between spreadsheets need optimization",
          "Sophisticated ERP but lacks integrations",
          "Core finance on ERP but reconciliations done outside",
          "Best practices adopted but adherence uncertain"
        ],
        solutions: [
          "Implement full ERP system integration",
          "Deploy automation scripts for routine tasks", 
          "Introduce RPA (Robotic Process Automation)",
          "Automate reporting processes completely"
        ]
      },
      4: {
        title: "Stage 4",
        subtitle: "Data-Driven & Predictive", 
        description: "FPA as a service, CFO support, predictive analytics automation",
        problems: [
          "Dynamic MIS and macros need enhancement",
          "Highly automated but integration gaps exist",
          "Completely automated but scope for improvement",
          "Documented best practices need better adherence monitoring"
        ],
        solutions: [
          "Enhance FPA services with advanced analytics",
          "Provide CFO support and strategic guidance",
          "Implement predictive analytics automation",
          "Deploy advanced business intelligence tools"
        ]
      },
      5: {
        title: "Stage 5",
        subtitle: "Strategic & Scalable",
        description: "Technical Acc, Outsourcing, IFRS/US GAAP advisory, legacy ERP overhaul", 
        problems: [
          "Predictive analysis capabilities need refinement",
          "Only financial statement preparation remains manual",
          "Investment-ready processes need global alignment",
          "IFC/ICFR controls need continuous improvement"
        ],
        solutions: [
          "Provide technical accounting expertise",
          "Offer comprehensive finance outsourcing",
          "Implement IFRS/US GAAP advisory services",
          "Overhaul legacy ERP systems for global standards"
        ]
      }
    };
    
    return stageDetails[stage as keyof typeof stageDetails] || stageDetails[1];
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      showNotification("🎯 Phase Complete!", `Moving to phase ${currentQuestion + 2} of ${questions.length}`);
    } else {
      // Calculate stage and get stage-based content
      const stage = calculateStage();
      const stageDetails = getStageDetails(stage);
      setIdentifiedProblems(stageDetails.problems);
      setCurrentStage('personal-details');
    }
  };

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      showNotification("⏭️ Skipped Phase", "Moving to the next phase of your heist plan.");
    } else {
      // Calculate stage and get stage-based content for skipped answers (default to stage 1)
      const stage = 1;
      const stageDetails = getStageDetails(stage);
      setIdentifiedProblems(stageDetails.problems);
      setCurrentStage('personal-details');
    }
  };

  const handlePersonalDetailsSubmit = () => {
    if (!personalDetails.fullName || !personalDetails.designation || !personalDetails.companyName) {
      showNotification("Intel Required", "We need all your details to complete the mission brief.");
      return;
    }
    setCurrentStage('results');
  };

  const handleReattempt = () => {
    // Reset all state
    setCurrentStage('intro');
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setIdentifiedProblems([]);
    setPersonalDetails({ fullName: '', designation: '', companyName: '' });
    showNotification("🔄 Mission Reset", "Starting fresh mission planning!");
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeedbackData(prev => ({ ...prev, profilePhoto: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context?.drawImage(video, 0, 0);
          
          const imageData = canvas.toDataURL('image/png');
          setFeedbackData(prev => ({ ...prev, profilePhoto: imageData }));
          
          stream.getTracks().forEach(track => track.stop());
        };
      })
      .catch(err => {
        console.error('Error accessing camera:', err);
        showNotification("Camera Error", "Unable to access camera. Please try uploading a photo instead.");
      });
  };

  const triggerEmojiFirework = (emoji: string) => {
    const newFirework = getEmojiForReaction(emoji);
    setEmojiFireworks(prev => [...prev, newFirework]);
    setTimeout(() => {
      setEmojiFireworks(prev => prev.slice(1));
    }, 2000);
  };

  const handleFeedbackSubmit = () => {
    if (feedbackData.rating === 0) {
      showNotification("Rating Required", "Please provide a rating for the assessment.");
      return;
    }

    const feedback: Feedback = {
      id: Date.now().toString(),
      name: personalDetails.fullName,
      rating: feedbackData.rating,
      reaction: feedbackData.reaction,
      message: feedbackData.message,
      timestamp: Date.now(),
      profilePhoto: feedbackData.profilePhoto
    };

    const updatedFeedback = [...feedbackList, feedback];
    setFeedbackList(updatedFeedback);
    setLatestFeedback(feedback);
    localStorage.setItem('finance-assessment-feedback', JSON.stringify(updatedFeedback));
    
    // Trigger emoji firework
    if (feedbackData.reaction) {
      triggerEmojiFirework(feedbackData.reaction);
    }
    
    // Trigger general firework effect
    setShowFirework(true);
    setTimeout(() => setShowFirework(false), 2000);
    
    setFeedbackData({ rating: 0, reaction: '', message: '', profilePhoto: '' });
    setShowFeedbackModal(false);
    showNotification("Thank you!", "Your feedback has been submitted successfully.");
  };

  const getProgress = () => {
    const totalSteps = questions.length + 1;
    let currentStep = 0;
    if (currentStage === 'questionnaire') currentStep = currentQuestion + 1;
    if (currentStage === 'personal-details') currentStep = questions.length + 1;
    if (currentStage === 'results') currentStep = totalSteps;
    return (currentStep / totalSteps) * 100;
  };

  const getEmojiForReaction = (reaction: string) => {
    switch (reaction) {
      case 'Great': return '😊';
      case 'Loved it': return '❤️';
      case 'Excellent': return '🔥';
      case 'Amazing': return '⚡';
      default: return '😊';
    }
  };

  if (currentStage === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
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
                animationDuration: `${3 + Math.random() * 2}s`
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
              animation: 'bounce 0.5s ease-out, fade-out 2s ease-out',
              animationFillMode: 'forwards'
            }}
          >
            {emoji}
            <div className="absolute inset-0 animate-ping">{emoji}</div>
          </div>
        ))}

        {/* Latest Feedback Display - Enhanced */}
        {latestFeedback && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <Card className="bg-gradient-to-br from-purple-800/95 to-blue-800/95 text-white shadow-2xl border-2 border-purple-400/50 backdrop-blur-sm max-w-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Profile Photo */}
                  <div className="flex-shrink-0">
                    {latestFeedback.profilePhoto ? (
                      <img 
                        src={latestFeedback.profilePhoto} 
                        alt={latestFeedback.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-300/50"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center border-2 border-purple-300/50">
                        <span className="text-lg font-bold">
                          {latestFeedback.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-3xl animate-bounce">
                        {getEmojiForReaction(latestFeedback.reaction)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-purple-100">Latest Review</h4>
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
                            i < latestFeedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
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
            <div className="absolute top-1/4 left-1/4 text-6xl animate-ping">🎉</div>
            <div className="absolute top-1/3 right-1/4 text-6xl animate-ping" style={{ animationDelay: '0.2s' }}>✨</div>
            <div className="absolute bottom-1/3 left-1/3 text-6xl animate-ping" style={{ animationDelay: '0.4s' }}>🎊</div>
            <div className="absolute bottom-1/4 right-1/3 text-6xl animate-ping" style={{ animationDelay: '0.6s' }}>💫</div>
          </div>
        )}

        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-800/80 to-blue-800/80 backdrop-blur-sm text-purple-100 px-6 py-3 rounded-full text-sm font-medium border border-purple-500/30 shadow-lg animate-fade-in">
              <Trophy className="w-5 h-5 animate-bounce" />
              <span>🎮 Elite Strategy Assessment</span>
            </div>
            
            <h1 className="text-6xl font-bold text-white leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Plan the Perfect 
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent animate-pulse"> Creative Heist</span>
            </h1>
            
            <p className="text-xl text-purple-200 leading-relaxed max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
              🚀 You're the mastermind. It's time to steal back your brand's power with precision strategy and flawless execution. 
              This mission won't be easy, but you're not alone.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Card className="border-2 border-purple-500/30 bg-slate-800/50 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20 transform hover:scale-105 group">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:animate-bounce">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-sm text-white">Assemble Crew</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-purple-300 text-xs">Recruit the perfect specialists for your mission</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500/30 bg-slate-800/50 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/20 transform hover:scale-105 group">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:animate-bounce">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-sm text-white">Plan Entry</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-blue-300 text-xs">Identify the perfect infiltration point</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/30 bg-slate-800/50 backdrop-blur-sm hover:border-green-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/20 transform hover:scale-105 group">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:animate-bounce">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-sm text-white">Secure Loot</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-green-300 text-xs">Define your strategic objectives</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-500/30 bg-slate-800/50 backdrop-blur-sm hover:border-orange-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/20 transform hover:scale-105 group">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:animate-bounce">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-sm text-white">Execute Plan</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-orange-300 text-xs">Launch your strategic campaign</p>
              </CardContent>
            </Card>
          </div>

          <div className="pt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-slate-700 via-purple-700 to-slate-800 hover:from-slate-600 hover:via-purple-600 hover:to-slate-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-110 border border-purple-400/30 backdrop-blur-sm relative overflow-hidden group"
              style={{ 
                animation: 'pulse 4s ease-in-out infinite',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              🎯 Start Your Quest
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStage === 'questionnaire') {
    const question = questions[currentQuestion];
    const progress = getProgress();

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Top notification */}
        {showTopNotification && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <Card className="bg-gradient-to-r from-purple-800 to-blue-800 text-white shadow-2xl border-purple-500/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="font-bold text-sm">{showTopNotification.title}</h4>
                <p className="text-xs opacity-90">{showTopNotification.message}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto py-8 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-800/80 to-blue-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 border border-purple-500/30">
                <Eye className="w-4 h-4 text-purple-300" />
                <span className="text-purple-100">🕴️ Planning the Perfect Heist</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                You're the mastermind. It's time to plan the perfect creative heist to steal back your brand's power.
              </h1>
              <p className="text-purple-200">This mission won't be easy, but you're not alone. Let's build your crew and map the plan.</p>
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
                {question.description} {question.multiSelect && "🎯 Select all that apply"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {question.options.map((option) => {
                const isSelected = selectedAnswers[question.id]?.includes(option.id) || false;
                const IconComponent = option.icon;
                
                return (
                  <div
                    key={option.id}
                    onClick={() => handleAnswerSelect(question.id, option.id, option.problem)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-500 hover:shadow-lg transform hover:scale-[1.02] group ${
                      isSelected 
                        ? 'border-purple-400 bg-gradient-to-r from-purple-800/70 to-blue-800/70 shadow-lg shadow-purple-500/20' 
                        : 'border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isSelected ? 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg' : 'bg-slate-700 group-hover:bg-slate-600'
                        }`}>
                          <IconComponent className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                        </div>
                        <div className="flex-1">
                          <div className={`text-xl font-bold mb-1 ${isSelected ? 'text-purple-100' : 'text-slate-200'}`}>
                            {option.text}
                          </div>
                          <div className={`text-sm ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                            {option.description}
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isSelected ? 'border-purple-400 bg-purple-500 scale-110' : 'border-slate-500 hover:border-slate-400'
                        }`}>
                          {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-8 py-3 bg-slate-800/80 text-white border-slate-600 hover:bg-slate-700 backdrop-blur-sm disabled:opacity-50"
            >
              ← Previous Phase
            </Button>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline"
                onClick={handleSkip}
                className="px-8 py-3 text-slate-300 hover:text-white bg-slate-800/80 border-slate-600 hover:bg-slate-700 backdrop-blur-sm"
              >
                ⏭️ Skip Phase
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentQuestion === questions.length - 1 ? '🎯 Complete Mission Planning' : 'Next Phase'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStage === 'personal-details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Top notification */}
        {showTopNotification && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <Card className="bg-gradient-to-r from-purple-800 to-blue-800 text-white shadow-2xl border-purple-500/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="font-bold text-sm">{showTopNotification.title}</h4>
                <p className="text-xs opacity-90">{showTopNotification.message}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="max-w-2xl mx-auto py-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-800/80 to-blue-800/80 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-500/30">
              <PartyPopper className="w-6 h-6 text-purple-300" />
              <span className="text-lg font-bold text-purple-100">
                🎯 Mission Intel Required!
              </span>
            </div>
          </div>

          <Card className="shadow-2xl border-0 relative overflow-hidden bg-slate-800/90 backdrop-blur-lg border-purple-500/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
            <CardHeader className="pb-6 text-center">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center">
                <PartyPopper className="w-6 h-6 mr-2 text-purple-400" />
                Mission Intel Required!
              </CardTitle>
              <CardDescription className="text-base text-purple-200">
                🏆 Final details needed to complete your personalized mission brief
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-purple-200">Full Name *</Label>
                <Input
                  id="fullName"
                  value={personalDetails.fullName}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                  className="h-12 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 backdrop-blur-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation" className="text-sm font-medium text-purple-200">Designation *</Label>
                <Input
                  id="designation"
                  value={personalDetails.designation}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="Enter your job title/designation"
                  className="h-12 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 backdrop-blur-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium text-purple-200">Company Name *</Label>
                <Input
                  id="companyName"
                  value={personalDetails.companyName}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter your company name"
                  className="h-12 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 backdrop-blur-sm"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button 
              onClick={handlePersonalDetailsSubmit}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Generate Mission Brief
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStage === 'results') {
    // Calculate stage based on selected answers
    const stage = calculateStage();
    const stageDetails = getStageDetails(stage);
    
    // Use stage-based solutions
    const stageSolutions = stageDetails.solutions.map((solution, index) => ({
      problem: stageDetails.problems[index] || `Challenge ${index + 1}`,
      icon: Target,
      solution: solution,
      heistDescription: `Strategic implementation for ${stageDetails.subtitle.toLowerCase()}.`
    }));

    const solutionsToShow = stageSolutions;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Top notification */}
        {showTopNotification && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <Card className="bg-gradient-to-r from-purple-800 to-blue-800 text-white shadow-2xl border-purple-500/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="font-bold text-sm">{showTopNotification.title}</h4>
                <p className="text-xs opacity-90">{showTopNotification.message}</p>
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
                    <CardTitle className="text-lg text-slate-900">Share Your Experience</CardTitle>
                    <CardDescription>Help us improve our assessment for future users</CardDescription>
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
                {/* Profile Photo Section */}
                <div className="text-center">
                  <Label className="text-sm font-medium text-slate-700 mb-3 block">Add your profile photo (optional)</Label>
                  <div className="flex items-center justify-center space-x-4">
                    {feedbackData.profilePhoto ? (
                      <div className="relative">
                        <img 
                          src={feedbackData.profilePhoto} 
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-4 border-purple-200"
                        />
                        <button
                          onClick={() => setFeedbackData(prev => ({ ...prev, profilePhoto: '' }))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-purple-200">
                        {personalDetails.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div className="flex flex-col space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCameraCapture}
                        className="flex items-center space-x-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Selfie</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-3 block">How would you rate this assessment?</Label>
                  <div className="flex space-x-2 justify-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFeedbackData(prev => ({ ...prev, rating }))}
                        className={`w-12 h-12 rounded-full transition-all duration-200 ${
                          feedbackData.rating >= rating
                            ? 'text-yellow-400 scale-110'
                            : 'text-slate-300 hover:text-yellow-300'
                        }`}
                      >
                        <Star className="w-10 h-10" fill={feedbackData.rating >= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-3 block">Quick reaction</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { emoji: '😊', label: 'Great', icon: ThumbsUp },
                      { emoji: '❤️', label: 'Loved it', icon: Heart },
                      { emoji: '🔥', label: 'Excellent', icon: Flame },
                      { emoji: '⚡', label: 'Amazing', icon: Zap }
                    ].map((reaction) => (
                      <button
                        key={reaction.label}
                        onClick={() => setFeedbackData(prev => ({ ...prev, reaction: reaction.label }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 transform ${
                          feedbackData.reaction === reaction.label
                            ? 'border-purple-500 bg-purple-50 scale-105'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = feedbackData.reaction === reaction.label ? 'scale(1.05)' : 'scale(1)';
                        }}
                      >
                        <div className="text-2xl mb-1">{reaction.emoji}</div>
                        <div className="text-xs text-slate-600">{reaction.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="feedback-message" className="text-sm font-medium text-slate-700">Additional feedback (optional)</Label>
                  <Textarea
                    id="feedback-message"
                    value={feedbackData.message}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, message: e.target.value }))}
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
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto py-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm px-8 py-4 rounded-full mb-6 border border-yellow-500/30">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-300">
                🏆 {stageDetails.title}: {stageDetails.subtitle}
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{stageDetails.description}</h2>
            </div>
            
            <p className="text-xl text-purple-200 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Congratulations, {personalDetails.fullName}! Based on your responses, {personalDetails.companyName} is at {stageDetails.title}. Here's your customized roadmap:
            </p>
          </div>

          {/* Strategic Solutions or Congratulations */}
          <div className="space-y-6 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {identifiedProblems.length > 0 ? (
              <>
                <h2 className="text-3xl font-bold text-white text-center mb-8">🎯 Your Custom Strategic Solutions</h2>
                <div className="grid gap-6">
                  {solutionsToShow.map((solution, index) => {
                    if (!solution) return null;
                    
                    const IconComponent = solution.icon;
                    
                    return (
                      <Card key={index} className="shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden bg-gradient-to-br from-slate-800/90 to-purple-900/90 backdrop-blur-lg text-white border-2 border-purple-600/50">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                        <CardHeader className="pb-4">
                          <div className="flex items-start space-x-4">
                            <div className="p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl font-bold text-white mb-2">
                                🎯 {solution.problem}
                              </CardTitle>
                              <Badge variant="outline" className="text-purple-200 border-purple-400 bg-purple-800/50">
                                ⚡ Strategic Solution
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-slate-200 text-lg leading-relaxed">
                              <span className="font-semibold text-purple-300">🚀 Our Approach:</span> {solution.solution}
                            </p>
                            <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-600/30">
                              <p className="text-purple-200 text-sm font-medium mb-1">🕴️ Mission Execution:</p>
                              <p className="text-white">{solution.heistDescription}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white text-center mb-8">🎉 Excellent Financial Position!</h2>
                <Card className="shadow-xl relative overflow-hidden bg-gradient-to-br from-green-800/90 to-emerald-900/90 backdrop-blur-lg text-white border-2 border-green-600/50 max-w-4xl mx-auto">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <CardHeader className="pb-4 text-center">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full shadow-lg">
                        <Trophy className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      🏆 Outstanding Financial Management!
                    </CardTitle>
                    <Badge variant="outline" className="text-green-200 border-green-400 bg-green-800/50">
                      ✨ No Action Required
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-6">
                      <div className="text-6xl mb-4">🎯💰✨</div>
                      <p className="text-green-100 text-xl leading-relaxed">
                        Congratulations, {personalDetails.fullName}! Your financial strategy appears to be on solid ground. 
                        You've demonstrated excellent financial discipline and strategic thinking.
                      </p>
                      <div className="bg-green-800/50 p-6 rounded-lg border border-green-600/30">
                        <p className="text-green-200 text-lg font-medium mb-2">🌟 Your Financial Excellence:</p>
                        <p className="text-white text-lg">
                          Based on your responses, {personalDetails.companyName} appears to have strong financial foundations. 
                          Keep up the excellent work! Consider our consultation if you want to explore growth opportunities.
                        </p>
                      </div>
                      <div className="flex justify-center space-x-4 pt-4">
                        <div className="text-center">
                          <div className="text-3xl mb-2">🎉</div>
                          <p className="text-green-200 text-sm">Well Done</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl mb-2">💪</div>
                          <p className="text-green-200 text-sm">Strong Position</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl mb-2">🚀</div>
                          <p className="text-green-200 text-sm">Ready to Scale</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-800/80 to-blue-800/80 backdrop-blur-lg border-2 border-purple-500/50 shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-white mb-4">🎯 Ready to Execute Your Mission?</h3>
                <p className="text-xl text-purple-200 mb-8">
                  Your crew is assembled, the plan is set, and the target is in sight. 
                  Let's meet your team and finalize the execution strategy.
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
                    onClick={() => window.open('https://calendly.com/contetrapvtlimited/30min?month=2023-12', '_blank')}
                    className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-8 py-3 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-emerald-400/30 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Calendar className="mr-3 w-5 h-5" />
                    Schedule Consultation
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mt-6">
                  <p className="text-lg text-purple-300">
                    💎 <strong>Limited Time:</strong> Book your strategy session in the next 48 hours and receive a 25% discount on your first mission package.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
