import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Info, Volume2, VolumeX, Captions, Play, Pause, Maximize2, Minimize2 } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import type { Career } from "@shared/schema";

// Career models mapping
const careerModels = {
  "Software Engineer": "ea1d5422c80141aa8ec2478cc359fe41",
  "UX Designer": "79f9b91fbc3549f4a55afd0080bd2814",
  "Data Scientist": "ea1d5422c80141aa8ec2478cc359fe41",
  "Healthcare Professional": "eaca09ed02ba401f8728113e17a2ce3b",
  "Teacher": "3ef2c187483c4c508be5c41dbf329399",
  "Product Manager": "6c748db3333b4e31b362e5ded0b5de08",
  "Financial Analyst": "fc257d5852d04b278beb5d1d949e7055",
  "Entrepreneur": "aeba399d4c66413da4ba4ad0f537aa99"
};

// Team members for each career (all male)
const careerTours = {
  "Software Engineer": [
    {
      id: "teamLead",
      name: "David Chen",
      role: "Engineering Team Lead",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      duration: 25,
      script: `As the Engineering Team Lead, I coordinate between developers, product managers, and stakeholders. My day starts with checking project progress and unblocking any team members facing challenges. I spend most of my time in meetings - planning sprints, reviewing code, and mentoring junior developers. The biggest challenge? Balancing technical debt with new feature development while keeping the team motivated and productive.`,
      tools: [
        { name: "Jira", icon: "📊", image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop" },
        { name: "Slack", icon: "💬", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=300&h=200&fit=crop" },
        { name: "GitHub", icon: "🐙", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: "frontendDev",
      name: "Alex Rodriguez", 
      role: "Frontend Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      duration: 28,
      script: `I'm a Frontend Engineer specializing in React and TypeScript. My main focus is building responsive, accessible user interfaces. Right now, I'm working on a new authentication system. The challenge? Making sure it works perfectly across all browsers and devices while maintaining security. Debugging CSS issues and handling different screen sizes can be tricky, but seeing users enjoy a smooth experience makes it worth it!`,
      tools: [
        { name: "VS Code", icon: "⚡", image: "https://images.unsplash.com/photo-1566837944797-45d3d1e23ce4?w=300&h=200&fit=crop" },
        { name: "React", icon: "⚛️", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop" },
        { name: "Chrome DevTools", icon: "🔍", image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=300&h=200&fit=crop" }
      ]
    }
  ],
  "UX Designer": [
    {
      id: "seniorDesigner",
      name: "Marcus Lee",
      role: "Senior UX Designer",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face",
      duration: 26,
      script: `As a Senior UX Designer, I focus on creating intuitive and engaging user experiences. My day involves user research, creating wireframes, and collaborating with developers. Right now, I'm designing a new mobile app interface. The challenge? Balancing user needs with business requirements while maintaining design consistency across all platforms.`,
      tools: [
        { name: "Figma", icon: "🎨", image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop" },
        { name: "Adobe XD", icon: "✏️", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=300&h=200&fit=crop" },
        { name: "User Testing", icon: "👥", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: "uiDesigner",
      name: "Ryan Park",
      role: "UI Designer",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face",
      duration: 24,
      script: `I'm a UI Designer responsible for the visual aspects of our products. I work on color schemes, typography, and interactive elements. Currently, I'm creating a design system to ensure consistency across all our applications. The challenge? Making complex information beautiful and accessible while meeting tight deadlines.`,
      tools: [
        { name: "Sketch", icon: "✏️", image: "https://images.unsplash.com/photo-1566837944797-45d3d1e23ce4?w=300&h=200&fit=crop" },
        { name: "Illustrator", icon: "🖌️", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop" },
        { name: "Prototyping", icon: "📱", image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=300&h=200&fit=crop" }
      ]
    }
  ],
  "Data Scientist": [
    {
      id: "dataScientist",
      name: "Dr. Michael Zhang",
      role: "Lead Data Scientist",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      duration: 27,
      script: `As a Lead Data Scientist, I transform raw data into actionable insights. My work involves statistical analysis, machine learning, and predictive modeling. Currently, I'm building a recommendation engine for our e-commerce platform. The challenge? Handling massive datasets while ensuring model accuracy and interpretability for business stakeholders.`,
      tools: [
        { name: "Python", icon: "🐍", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=300&h=200&fit=crop" },
        { name: "Jupyter", icon: "📓", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop" },
        { name: "TensorFlow", icon: "🧠", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: "dataAnalyst",
      name: "Kevin Patel",
      role: "Data Analyst",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      duration: 25,
      script: `I'm a Data Analyst focused on extracting meaningful patterns from data. I create dashboards, run A/B tests, and provide insights to product teams. Right now, I'm analyzing user behavior data to improve our app's retention rates. The challenge? Cleaning messy data and presenting findings in a way that non-technical stakeholders can understand.`,
      tools: [
        { name: "SQL", icon: "🗃️", image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300&h=200&fit=crop" },
        { name: "Tableau", icon: "📊", image: "https://images.unsplash.com/photo-1586769852044-692a56f6baf3?w=300&h=200&fit=crop" },
        { name: "Excel", icon: "📈", image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop" }
      ]
    }
  ],
  "Healthcare Professional": [
    {
      id: "doctor",
      name: "Dr. James Wilson",
      role: "Senior Physician",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      duration: 28,
      script: `As a Senior Physician, I diagnose and treat patients while leading a team of medical professionals. My day involves patient consultations, medical procedures, and staying updated with the latest research. The challenge? Making accurate diagnoses under pressure while providing compassionate care and managing administrative tasks.`,
      tools: [
        { name: "Stethoscope", icon: "🩺", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop" },
        { name: "EHR System", icon: "💻", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop" },
        { name: "Medical Imaging", icon: "📷", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: "nurse",
      name: "Robert Martinez",
      role: "Registered Nurse",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
      duration: 26,
      script: `As a Registered Nurse, I provide direct patient care, administer medications, and assist doctors with procedures. I'm responsible for monitoring patient vitals and ensuring their comfort. The challenge? Managing multiple patients simultaneously while maintaining accurate records and providing emotional support to families.`,
      tools: [
        { name: "Patient Monitor", icon: "📟", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&h=200&fit=crop" },
        { name: "Medication Cart", icon: "💊", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop" },
        { name: "Medical Charts", icon: "📋", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop" }
      ]
    }
  ],
  "Teacher": [
    {
      id: "mathTeacher",
      name: "Mr. David Kim",
      role: "Mathematics Teacher",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      duration: 27,
      script: `As a Mathematics Teacher, I help students develop problem-solving skills and mathematical thinking. My day involves lesson planning, classroom instruction, and individual student support. Currently, I'm preparing students for their final exams. The challenge? Making abstract concepts accessible to students with different learning styles while managing a classroom of 30+ students.`,
      tools: [
        { name: "Whiteboard", icon: "📝", image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=300&h=200&fit=crop" },
        { name: "Textbooks", icon: "📚", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop" },
        { name: "Learning Apps", icon: "📱", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: "scienceTeacher",
      name: "Mr. Thomas Reed",
      role: "Science Teacher",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      duration: 25,
      script: `I'm a Science Teacher passionate about making science engaging and relevant. I conduct experiments, demonstrate scientific principles, and foster curiosity. Right now, we're studying environmental science and climate change. The challenge? Making complex scientific concepts understandable while ensuring lab safety and meeting curriculum standards.`,
      tools: [
        { name: "Lab Equipment", icon: "🔬", image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=200&fit=crop" },
        { name: "Microscope", icon: "🔍", image: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=300&h=200&fit=crop" },
        { name: "Science Kits", icon: "🧪", image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=300&h=200&fit=crop" }
      ]
    }
  ],
  "Product Manager": [
    {
      id: "productManager",
      name: "Daniel Thompson",
      role: "Senior Product Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      duration: 28,
      script: `As a Senior Product Manager, I bridge the gap between business needs and technical execution. I define product vision, prioritize features, and work with cross-functional teams. Currently, I'm launching a new product feature that addresses user feedback. The challenge? Balancing stakeholder expectations, technical constraints, and user needs while delivering on schedule.`,
      tools: [
        { name: "Product Roadmap", icon: "🗺️", image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop" },
        { name: "Analytics", icon: "📈", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop" },
        { name: "User Stories", icon: "📋", image: "https://images.unsplash.com/photo-1586769852044-692a56f6baf3?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: "productOwner",
      name: "Mark Robinson",
      role: "Product Owner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      duration: 26,
      script: `As a Product Owner, I work closely with development teams to deliver valuable features. I manage the product backlog, write user stories, and participate in sprint planning. Right now, I'm refining requirements for our next release. The challenge? Translating vague business requirements into clear, actionable tasks for developers while maintaining product quality.`,
      tools: [
        { name: "Backlog", icon: "📝", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=300&h=200&fit=crop" },
        { name: "Sprint Planning", icon: "📅", image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=300&h=200&fit=crop" },
        { name: "User Feedback", icon: "💬", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=300&h=200&fit=crop" }
      ]
    }
  ],
  "Financial Analyst": [
    {
      id: "financialAnalyst",
      name: "Andrew Chen",
      role: "Senior Financial Analyst",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face",
      duration: 27,
      script: `As a Senior Financial Analyst, I analyze financial data to guide business decisions. I create financial models, forecast trends, and evaluate investment opportunities. Currently, I'm analyzing market trends for our quarterly report. The challenge? Interpreting complex financial data accurately while considering economic uncertainties and providing clear recommendations to executives.`,
      tools: [
        { name: "Excel", icon: "📊", image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop" },
        { name: "Bloomberg", icon: "💹", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=300&h=200&fit=crop" },
        { name: "Financial Models", icon: "📈", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: "investmentAnalyst",
      name: "Brian Park",
      role: "Investment Analyst",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face",
      duration: 25,
      script: `I'm an Investment Analyst focused on evaluating stocks and investment opportunities. I research companies, analyze financial statements, and build valuation models. Right now, I'm preparing investment recommendations for our clients. The challenge? Making sound investment decisions in volatile markets while considering both quantitative data and qualitative factors.`,
      tools: [
        { name: "Trading Platform", icon: "💻", image: "https://images.unsplash.com/photo-1566837944797-45d3d1e23ce4?w=300&h=200&fit=crop" },
        { name: "Market Data", icon: "📡", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop" },
        { name: "Research Reports", icon: "📑", image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=300&h=200&fit=crop" }
      ]
    }
  ],
  "Entrepreneur": [
    {
      id: "startupFounder",
      name: "Jason Miller",
      role: "Startup Founder",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      duration: 29,
      script: `As a Startup Founder, I wear many hats - from product development to fundraising and team building. I'm currently scaling our tech startup that's disrupting the e-commerce space. The challenge? Making critical decisions with limited resources, managing investor expectations, and building a company culture while achieving rapid growth.`,
      tools: [
        { name: "Pitch Deck", icon: "📊", image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=300&h=200&fit=crop" },
        { name: "Business Plan", icon: "📈", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop" },
        { name: "Networking", icon: "🤝", image: "https://images.unsplash.com/photo-1551836026-d5c88ac5c73d?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: "businessOwner",
      name: "Kevin Zhao",
      role: "Small Business Owner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      duration: 26,
      script: `I own and operate a chain of local retail stores. My responsibilities range from inventory management to marketing and customer service. We're currently expanding to new locations. The challenge? Balancing day-to-day operations with long-term strategic planning, managing cash flow, and staying competitive in a changing market.`,
      tools: [
        { name: "POS System", icon: "💳", image: "https://images.unsplash.com/photo-1563013541-666ab3408ab0?w=300&h=200&fit=crop" },
        { name: "Inventory Mgmt", icon: "📦", image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=300&h=200&fit=crop" },
        { name: "Marketing", icon: "📢", image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=300&h=200&fit=crop" }
      ]
    }
  ]
};

export default function ARPreview() {
  const [, setLocation] = useLocation();
  const [career, setCareer] = useState<Career | null>(null);
  const { user } = useAuth();
  
  // Tour states
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [audioMuted, setAudioMuted] = useState(false);
  const [currentToolIndex, setCurrentToolIndex] = useState(0);
  
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedCareer");
    if (!stored) {
      setLocation("/browse-careers");
      return;
    }
    const careerData = JSON.parse(stored);
    setCareer(careerData);
  }, [setLocation]);

  const currentMember = career ? careerTours[career.title as keyof typeof careerTours]?.[currentMemberIndex] : null;
  const teamMembers = career ? careerTours[career.title as keyof typeof careerTours] || [] : [];

  useEffect(() => {
    if (isFullScreen && isPlaying) {
      startSpeaking();
    } else {
      stopSpeaking();
    }
  }, [isPlaying, currentMemberIndex, isFullScreen]);

  useEffect(() => {
    // Rotate through tools every 3 seconds while speaking
    let toolInterval: NodeJS.Timeout;
    if (isPlaying && isFullScreen && currentMember) {
      toolInterval = setInterval(() => {
        setCurrentToolIndex(prev => (prev + 1) % currentMember.tools.length);
      }, 3000);
    }
    return () => clearInterval(toolInterval);
  }, [isPlaying, currentMemberIndex, isFullScreen, currentMember]); // Added currentMember to dependencies

  const enterFullScreen = async () => {
    try {
      const element = mainContainerRef.current;
      if (element) {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
        setIsFullScreen(true);
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      setIsFullScreen(true);
    }
  };

  const exitFullScreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    } finally {
      setIsFullScreen(false);
      setIsPlaying(false);
    }
  };

  const startTour = () => {
    setCurrentMemberIndex(0);
    setIsPlaying(true);
  };

  const startSpeaking = () => {
    stopSpeaking();
    
    if ('speechSynthesis' in window && currentMember) {
      speechSynthRef.current = new SpeechSynthesisUtterance(currentMember.script);
      
      // Set male voice
      const voices = speechSynthesis.getVoices();
      let preferredVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('male') ||
        voice.name.toLowerCase().includes('alex') ||
        voice.name.toLowerCase().includes('daniel') ||
        voice.name.toLowerCase().includes('thomas') ||
        voice.name.toLowerCase().includes('google uk english male') ||
        voice.name.toLowerCase().includes('english male')
      );
      
      if (preferredVoice) {
        speechSynthRef.current.voice = preferredVoice;
      }
      
      speechSynthRef.current.rate = 0.9;
      speechSynthRef.current.pitch = 0.9;
      speechSynthRef.current.volume = audioMuted ? 0 : 1;
      
      speechSynthRef.current.onend = () => {
        moveToNextMember();
      };
      
      speechSynthRef.current.onerror = () => {
        moveToNextMember();
      };
      
      speechSynthesis.speak(speechSynthRef.current);
    } else if (currentMember) {
      setTimeout(() => {
        moveToNextMember();
      }, currentMember.duration * 1000);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthRef.current) {
      speechSynthesis.cancel();
    }
  };

  const moveToNextMember = () => {
    if (currentMemberIndex < teamMembers.length - 1) {
      setCurrentMemberIndex(prev => prev + 1);
      setCurrentToolIndex(0);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setAudioMuted(!audioMuted);
    if (speechSynthRef.current) {
      speechSynthRef.current.volume = audioMuted ? 1 : 0;
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Load voices when available
  useEffect(() => {
    const loadVoices = () => {
      // Voices are loaded asynchronously
    };
    
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  if (!career || !currentMember) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-xl text-muted-foreground">Loading Career Tour...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentMemberIndex + 1) / teamMembers.length) * 100;
  const modelId = careerModels[career.title as keyof typeof careerModels] || careerModels["Software Engineer"];

  // Pre-fullscreen view
  if (!isFullScreen) {
    return (
      <div ref={mainContainerRef} className="min-h-screen bg-background flex flex-col">
        <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/browse-careers")}
              className="h-10 px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Button>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {career.title} Tour
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl text-center space-y-8">
            <div className="space-y-4">
              <Sparkles className="w-16 h-16 text-primary mx-auto" />
              <h1 className="text-4xl font-bold">{career.title} Career Tour</h1>
              <p className="text-xl text-muted-foreground">
                Experience a day in the life of {career.title.toLowerCase()} through an immersive full-screen tour
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <Maximize2 className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Full Screen Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Enter full-screen mode for an immersive environment
                </p>
              </div>
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <Volume2 className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Audio Narration</h3>
                <p className="text-sm text-muted-foreground">
                  Listen to professionals describe their daily work
                </p>
              </div>
            </div>

            <Button 
              onClick={enterFullScreen} 
              className="h-14 text-lg px-8"
              size="lg"
            >
              <Maximize2 className="w-5 h-5 mr-2" />
              Enter Full Screen Tour
            </Button>

            <p className="text-sm text-muted-foreground">
              You'll meet {teamMembers.length} different {career.title.toLowerCase()}s and learn about their roles
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full-screen tour experience
  return (
    <div className="fixed inset-0 bg-black flex flex-col" style={{ width: '100vw', height: '100vh' }}>
      {/* AR Background - FULLY INTERACTIVE */}
      <div className="absolute inset-0">
        <iframe 
          title={`${career.title} Environment`}
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; camera"
          src={`https://sketchfab.com/models/${modelId}/embed?ui_controls=1&ui_infos=0&ui_stop=0&ui_annotations=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_hint=0&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&autospin=0&autostart=1&preload=1&camera=0&interaction=1`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allowTransparency={true}
        />
      </div>
      
      {/* Semi-transparent Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

      {/* Top Controls Bar */}
      <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-40">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={exitFullScreen}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4 mr-2" />
                Exit Full Screen
              </Button>
              
              <div className="text-white">
                <span className="font-medium">{currentMember.name}</span>
                <span className="mx-2">•</span>
                <span className="text-white/80">{currentMember.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubtitles(!showSubtitles)}
                className="text-white hover:bg-white/20"
              >
                <Captions className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>Meeting the Team</span>
              <span>{currentMemberIndex + 1} of {teamMembers.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Small Tool Preview in Top Right Corner */}
      <div className="absolute top-20 right-4 z-30">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-2xl w-48">
          <div className="text-center mb-2">
            <h3 className="text-sm font-bold text-white mb-1">
              {currentMember.tools[currentToolIndex].name}
            </h3>
            <p className="text-xs text-white/80">Tool Preview</p>
          </div>
          
          <div className="aspect-video bg-black/50 rounded-lg border border-white/20 overflow-hidden mb-2 select-none pointer-events-none">
            <img 
              src={currentMember.tools[currentToolIndex].image}
              alt={currentMember.tools[currentToolIndex].name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-center gap-1">
            {currentMember.tools.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentToolIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Left Side - Character Display */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl max-w-xs">
          {/* Character Image */}
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl mx-auto bg-gray-600">
              <img 
                src={currentMember.image} 
                alt={currentMember.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Speaking Indicator */}
            {isPlaying && (
              <div className="absolute -top-1 -right-1">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-ping">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Character Info */}
          <div className="text-center text-white">
            <h2 className="text-xl font-bold mb-1">{currentMember.name}</h2>
            <p className="text-sm text-blue-300 font-medium">{currentMember.role}</p>
          </div>
        </div>
      </div>

      {/* Bottom Controls - Only Play/Pause */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <Button
            onClick={togglePlayPause}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Subtitles */}
      {showSubtitles && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-4xl px-8">
          <div className="bg-black/80 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <p className="text-base leading-relaxed text-center text-white">
              {currentMember.script}
            </p>
          </div>
        </div>
      )}

      {/* Welcome Overlay - Only show at start of tour */}
      {currentMemberIndex === 0 && !isPlaying && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md border border-white/20 text-center text-white">
            <Sparkles className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{career.title} Tour Started!</h2>
            <p className="text-white/80 mb-6">
              You'll now meet our {career.title.toLowerCase()} team. Each member will introduce themselves and their work.
            </p>
            <Button onClick={startTour} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Start Introductions
            </Button>
          </div>
        </div>
      )}

      {/* Tour Complete Overlay */}
      {currentMemberIndex === teamMembers.length - 1 && !isPlaying && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md border border-white/20 text-center text-white">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Tour Complete!</h2>
            <p className="text-white/80 mb-6">
              You've met the {career.title.toLowerCase()} team and learned about their daily work.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={startTour} 
                variant="outline"
                className="flex-1 border-white text-white hover:bg-white/20"
              >
                Restart Tour
              </Button>
              <Button 
                onClick={exitFullScreen} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Finish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}