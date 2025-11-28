import type { Career, QuizQuestion } from "@shared/schema";

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How do you prefer to spend your free time?",
    category: "interests",
    options: [
      {
        id: "1a",
        text: "Building or fixing things with my hands",
        value: 3,
        careers: ["Software Engineer", "Architect", "Mechanical Engineer"],
      },
      {
        id: "1b",
        text: "Reading, writing, or creating art",
        value: 3,
        careers: ["UX Designer", "Content Writer", "Graphic Designer"],
      },
      {
        id: "1c",
        text: "Helping others or volunteering",
        value: 3,
        careers: ["Healthcare Professional", "Teacher", "Social Worker"],
      },
      {
        id: "1d",
        text: "Analyzing data or solving puzzles",
        value: 3,
        careers: ["Data Scientist", "Financial Analyst", "Research Scientist"],
      },
    ],
  },
  {
    id: 2,
    question: "In a team setting, you typically:",
    category: "personality",
    options: [
      {
        id: "2a",
        text: "Lead and organize the group",
        value: 3,
        careers: ["Project Manager", "Entrepreneur", "Product Manager"],
      },
      {
        id: "2b",
        text: "Support others and maintain harmony",
        value: 3,
        careers: ["HR Specialist", "Teacher", "Healthcare Professional"],
      },
      {
        id: "2c",
        text: "Focus on getting tasks done independently",
        value: 3,
        careers: ["Software Engineer", "Data Scientist", "Research Scientist"],
      },
      {
        id: "2d",
        text: "Generate creative ideas and solutions",
        value: 3,
        careers: ["UX Designer", "Marketing Specialist", "Architect"],
      },
    ],
  },
  {
    id: 3,
    question: "Which skill comes most naturally to you?",
    category: "skills",
    options: [
      {
        id: "3a",
        text: "Logical reasoning and problem-solving",
        value: 3,
        careers: ["Software Engineer", "Data Scientist", "Financial Analyst"],
      },
      {
        id: "3b",
        text: "Communication and empathy",
        value: 3,
        careers: ["Teacher", "Healthcare Professional", "HR Specialist"],
      },
      {
        id: "3c",
        text: "Visual design and creativity",
        value: 3,
        careers: ["UX Designer", "Graphic Designer", "Architect"],
      },
      {
        id: "3d",
        text: "Strategic thinking and planning",
        value: 3,
        careers: ["Product Manager", "Project Manager", "Entrepreneur"],
      },
    ],
  },
  {
    id: 4,
    question: "What type of work environment energizes you?",
    category: "personality",
    options: [
      {
        id: "4a",
        text: "Fast-paced with constant variety",
        value: 3,
        careers: ["Entrepreneur", "Marketing Specialist", "Project Manager"],
      },
      {
        id: "4b",
        text: "Structured with clear procedures",
        value: 3,
        careers: ["Financial Analyst", "Mechanical Engineer", "Healthcare Professional"],
      },
      {
        id: "4c",
        text: "Collaborative with lots of interaction",
        value: 3,
        careers: ["Teacher", "UX Designer", "HR Specialist"],
      },
      {
        id: "4d",
        text: "Quiet and focused for deep work",
        value: 3,
        careers: ["Software Engineer", "Data Scientist", "Research Scientist"],
      },
    ],
  },
  {
    id: 5,
    question: "When facing a challenge, you tend to:",
    category: "skills",
    options: [
      {
        id: "5a",
        text: "Research extensively before acting",
        value: 3,
        careers: ["Research Scientist", "Data Scientist", "Financial Analyst"],
      },
      {
        id: "5b",
        text: "Brainstorm multiple creative solutions",
        value: 3,
        careers: ["UX Designer", "Marketing Specialist", "Architect"],
      },
      {
        id: "5c",
        text: "Jump in and learn by doing",
        value: 3,
        careers: ["Entrepreneur", "Software Engineer", "Project Manager"],
      },
      {
        id: "5d",
        text: "Seek advice from experienced mentors",
        value: 3,
        careers: ["Teacher", "Healthcare Professional", "HR Specialist"],
      },
    ],
  },
  {
    id: 6,
    question: "Your ideal career would allow you to:",
    category: "interests",
    options: [
      {
        id: "6a",
        text: "Make a direct impact on people's lives",
        value: 3,
        careers: ["Healthcare Professional", "Teacher", "Social Worker"],
      },
      {
        id: "6b",
        text: "Build innovative products or systems",
        value: 3,
        careers: ["Software Engineer", "Product Manager", "Entrepreneur"],
      },
      {
        id: "6c",
        text: "Express yourself through creative work",
        value: 3,
        careers: ["UX Designer", "Graphic Designer", "Content Writer"],
      },
      {
        id: "6d",
        text: "Discover new insights through analysis",
        value: 3,
        careers: ["Data Scientist", "Research Scientist", "Financial Analyst"],
      },
    ],
  },
];

export const careers: Career[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    description: "Design, develop, and maintain software applications and systems that power modern technology.",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    salaryRange: { min: 800000, max: 2500000, currency: "INR" },
    growthPotential: 92,
    stressIndex: 62,
    mismatchProbability: 18,
    requiredSkills: ["Programming", "Problem Solving", "Logical Thinking", "Collaboration"],
    personalityTraits: ["Analytical", "Detail-oriented", "Patient", "Independent"],
    industryTrends: "AI/ML integration, cloud computing, cybersecurity - high demand expected through 2030",
    workspace3dModel: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    description: "Create intuitive and delightful user experiences for digital products through research and design.",
    category: "Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    salaryRange: { min: 600000, max: 1800000, currency: "INR" },
    growthPotential: 85,
    stressIndex: 54,
    mismatchProbability: 22,
    requiredSkills: ["Visual Design", "User Research", "Prototyping", "Communication"],
    personalityTraits: ["Creative", "Empathetic", "Collaborative", "Curious"],
    industryTrends: "Growing demand for mobile-first and accessible design, AI-assisted design tools emerging",
    workspace3dModel: "https://modelviewer.dev/shared-assets/models/CesiumMan.glb",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "Extract insights from complex datasets to drive business decisions and solve real-world problems.",
    category: "Analytics",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    salaryRange: { min: 900000, max: 2800000, currency: "INR" },
    growthPotential: 95,
    stressIndex: 68,
    mismatchProbability: 15,
    requiredSkills: ["Statistics", "Programming", "Machine Learning", "Data Visualization"],
    personalityTraits: ["Analytical", "Methodical", "Curious", "Independent"],
    industryTrends: "Explosive growth in AI/ML applications, highest demand in finance, healthcare, and tech sectors",
    workspace3dModel: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
  },
  {
    id: "healthcare-professional",
    title: "Healthcare Professional",
    description: "Provide essential medical care and improve patient health outcomes through direct clinical work.",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop",
    salaryRange: { min: 500000, max: 1500000, currency: "INR" },
    growthPotential: 78,
    stressIndex: 82,
    mismatchProbability: 12,
    requiredSkills: ["Medical Knowledge", "Empathy", "Communication", "Problem Solving"],
    personalityTraits: ["Compassionate", "Resilient", "Detail-oriented", "Collaborative"],
    industryTrends: "Telemedicine expansion, aging population driving demand, emphasis on preventive care",
    workspace3dModel: "https://modelviewer.dev/shared-assets/models/DamagedHelmet.glb",
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Inspire and educate the next generation by sharing knowledge and fostering critical thinking.",
    category: "Education",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da068326?w=500&h=300&fit=crop",
    salaryRange: { min: 350000, max: 900000, currency: "INR" },
    growthPotential: 65,
    stressIndex: 71,
    mismatchProbability: 25,
    requiredSkills: ["Communication", "Patience", "Subject Expertise", "Creativity"],
    workspace3dModel: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    personalityTraits: ["Patient", "Empathetic", "Organized", "Passionate"],
    industryTrends: "EdTech integration, personalized learning approaches, hybrid teaching models becoming standard",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    description: "Lead product strategy and execution, bridging business, technology, and user needs.",
    category: "Management",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    salaryRange: { min: 1200000, max: 3500000, currency: "INR" },
    growthPotential: 88,
    stressIndex: 75,
    mismatchProbability: 20,
    requiredSkills: ["Strategic Thinking", "Communication", "Leadership", "Technical Understanding"],
    personalityTraits: ["Strategic", "Collaborative", "Decisive", "Adaptable"],
    industryTrends: "Data-driven decision making, cross-functional leadership, focus on user-centric product development",
  },
  {
    id: "financial-analyst",
    title: "Financial Analyst",
    description: "Analyze financial data and market trends to guide investment decisions and business strategy.",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
    salaryRange: { min: 600000, max: 2000000, currency: "INR" },
    growthPotential: 76,
    stressIndex: 70,
    mismatchProbability: 24,
    requiredSkills: ["Financial Modeling", "Data Analysis", "Excel", "Communication"],
    personalityTraits: ["Analytical", "Detail-oriented", "Methodical", "Strategic"],
    industryTrends: "Automation of routine tasks, focus on strategic analysis, FinTech disruption creating new opportunities",
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    description: "Build and scale your own business, turning innovative ideas into successful ventures.",
    category: "Business",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    salaryRange: { min: 0, max: 5000000, currency: "INR" },
    growthPotential: 95,
    stressIndex: 95,
    mismatchProbability: 45,
    requiredSkills: ["Leadership", "Risk Management", "Networking", "Adaptability"],
    personalityTraits: ["Resilient", "Visionary", "Risk-taking", "Self-motivated"],
    industryTrends: "Startup ecosystem growing rapidly, access to digital tools and funding, focus on sustainable businesses",
  },
];

export function formatSalary(min: number | string, max?: number | string, currency: string = "INR"): string {
  const formatValue = (val: number | string | undefined) => {
    if (val === undefined || val === null) return "N/A";
    const numVal = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(numVal) || numVal === 0) return "N/A";
    if (numVal >= 10000000) return `₹${(numVal / 10000000).toFixed(1)}Cr`;
    if (numVal >= 100000) return `₹${(numVal / 100000).toFixed(0)}L`;
    return `₹${(numVal / 1000).toFixed(0)}K`;
  };

  if (!max) return formatValue(min);
  return `${formatValue(min)} - ${formatValue(max)}`;
}
