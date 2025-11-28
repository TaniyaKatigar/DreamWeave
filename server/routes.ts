import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchRealtimeCareers, fetchCareerMetrics } from "./gemini-insights";
import { 
  careerMatchRequestSchema, 
  saveAssessmentRequestSchema,
  type CareerMatchResponse,
  type CareerMatchResult,
  type Career,
  type QuizAnswer,
} from "@shared/schema";

// Career data - matches client-side data
const careers: Career[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    description: "Design, develop, and maintain software applications and systems that power modern technology.",
    category: "Technology",
    salaryRange: { min: 800000, max: 2500000, currency: "INR" },
    growthPotential: 92,
    stressIndex: 62,
    mismatchProbability: 18,
    requiredSkills: ["Programming", "Problem Solving", "Logical Thinking", "Collaboration"],
    personalityTraits: ["Analytical", "Detail-oriented", "Patient", "Independent"],
    industryTrends: "AI/ML integration, cloud computing, cybersecurity - high demand expected through 2030",
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    description: "Create intuitive and delightful user experiences for digital products through research and design.",
    category: "Design",
    salaryRange: { min: 600000, max: 1800000, currency: "INR" },
    growthPotential: 85,
    stressIndex: 54,
    mismatchProbability: 22,
    requiredSkills: ["Visual Design", "User Research", "Prototyping", "Communication"],
    personalityTraits: ["Creative", "Empathetic", "Collaborative", "Curious"],
    industryTrends: "Growing demand for mobile-first and accessible design, AI-assisted design tools emerging",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "Extract insights from complex datasets to drive business decisions and solve real-world problems.",
    category: "Analytics",
    salaryRange: { min: 900000, max: 2800000, currency: "INR" },
    growthPotential: 95,
    stressIndex: 68,
    mismatchProbability: 15,
    requiredSkills: ["Statistics", "Programming", "Machine Learning", "Data Visualization"],
    personalityTraits: ["Analytical", "Methodical", "Curious", "Independent"],
    industryTrends: "Explosive growth in AI/ML applications, highest demand in finance, healthcare, and tech sectors",
  },
  {
    id: "healthcare-professional",
    title: "Healthcare Professional",
    description: "Provide essential medical care and improve patient health outcomes through direct clinical work.",
    category: "Healthcare",
    salaryRange: { min: 500000, max: 1500000, currency: "INR" },
    growthPotential: 78,
    stressIndex: 82,
    mismatchProbability: 12,
    requiredSkills: ["Medical Knowledge", "Empathy", "Communication", "Problem Solving"],
    personalityTraits: ["Compassionate", "Resilient", "Detail-oriented", "Collaborative"],
    industryTrends: "Telemedicine expansion, aging population driving demand, emphasis on preventive care",
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Inspire and educate the next generation by sharing knowledge and fostering critical thinking.",
    category: "Education",
    salaryRange: { min: 350000, max: 900000, currency: "INR" },
    growthPotential: 65,
    stressIndex: 71,
    mismatchProbability: 25,
    requiredSkills: ["Communication", "Patience", "Subject Expertise", "Creativity"],
    personalityTraits: ["Patient", "Empathetic", "Organized", "Passionate"],
    industryTrends: "EdTech integration, personalized learning approaches, hybrid teaching models becoming standard",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    description: "Lead product strategy and execution, bridging business, technology, and user needs.",
    category: "Management",
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
    salaryRange: { min: 0, max: 5000000, currency: "INR" },
    growthPotential: 95,
    stressIndex: 95,
    mismatchProbability: 45,
    requiredSkills: ["Leadership", "Risk Management", "Networking", "Adaptability"],
    personalityTraits: ["Resilient", "Visionary", "Risk-taking", "Self-motivated"],
    industryTrends: "Startup ecosystem growing rapidly, access to digital tools and funding, focus on sustainable businesses",
  },
];

// Simple rule-based career matching algorithm
function calculateCareerMatch(answers: QuizAnswer[]): CareerMatchResult[] {
  const careerScores = new Map<string, { total: number; personality: number; skills: number; interests: number }>();

  // Initialize scores
  careers.forEach(career => {
    careerScores.set(career.title, { total: 0, personality: 0, skills: 0, interests: 0 });
  });

  // Calculate scores based on quiz answers
  answers.forEach(answer => {
    const question = getQuestionById(answer.questionId);
    if (!question) return;

    const option = question.options.find(opt => opt.id === answer.selectedOption);
    if (!option) return;

    // Add points to careers mentioned in the option
    option.careers.forEach(careerTitle => {
      const scores = careerScores.get(careerTitle);
      if (scores) {
        scores.total += answer.value;
        
        // Categorize by question type
        if (question.category === "personality") {
          scores.personality += answer.value;
        } else if (question.category === "skills") {
          scores.skills += answer.value;
        } else if (question.category === "interests") {
          scores.interests += answer.value;
        }
      }
    });
  });

  // Convert to match results with percentages
  const results: CareerMatchResult[] = [];
  const maxPossibleScore = answers.length * 3; // Each answer can contribute max 3 points

  careers.forEach(career => {
    const scores = careerScores.get(career.title);
    if (scores) {
      const matchScore = Math.round((scores.total / maxPossibleScore) * 100);
      results.push({
        career,
        matchScore,
        breakdown: {
          personalityMatch: Math.min(100, Math.round((scores.personality / 6) * 100)), // 2 personality questions max
          skillsMatch: Math.min(100, Math.round((scores.skills / 6) * 100)), // 2 skills questions max
          interestsMatch: Math.min(100, Math.round((scores.interests / 6) * 100)), // 2 interests questions max
        },
      });
    }
  });

  // Sort by match score descending
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

function getQuestionById(id: number) {
  const questions = [
    {
      id: 1,
      category: "interests" as const,
      options: [
        { id: "1a", careers: ["Software Engineer", "Architect", "Mechanical Engineer"], value: 3 },
        { id: "1b", careers: ["UX Designer", "Content Writer", "Graphic Designer"], value: 3 },
        { id: "1c", careers: ["Healthcare Professional", "Teacher", "Social Worker"], value: 3 },
        { id: "1d", careers: ["Data Scientist", "Financial Analyst", "Research Scientist"], value: 3 },
      ],
    },
    {
      id: 2,
      category: "personality" as const,
      options: [
        { id: "2a", careers: ["Project Manager", "Entrepreneur", "Product Manager"], value: 3 },
        { id: "2b", careers: ["HR Specialist", "Teacher", "Healthcare Professional"], value: 3 },
        { id: "2c", careers: ["Software Engineer", "Data Scientist", "Research Scientist"], value: 3 },
        { id: "2d", careers: ["UX Designer", "Marketing Specialist", "Architect"], value: 3 },
      ],
    },
    {
      id: 3,
      category: "skills" as const,
      options: [
        { id: "3a", careers: ["Software Engineer", "Data Scientist", "Financial Analyst"], value: 3 },
        { id: "3b", careers: ["Teacher", "Healthcare Professional", "HR Specialist"], value: 3 },
        { id: "3c", careers: ["UX Designer", "Graphic Designer", "Architect"], value: 3 },
        { id: "3d", careers: ["Product Manager", "Project Manager", "Entrepreneur"], value: 3 },
      ],
    },
    {
      id: 4,
      category: "personality" as const,
      options: [
        { id: "4a", careers: ["Entrepreneur", "Marketing Specialist", "Project Manager"], value: 3 },
        { id: "4b", careers: ["Financial Analyst", "Mechanical Engineer", "Healthcare Professional"], value: 3 },
        { id: "4c", careers: ["Teacher", "UX Designer", "HR Specialist"], value: 3 },
        { id: "4d", careers: ["Software Engineer", "Data Scientist", "Research Scientist"], value: 3 },
      ],
    },
    {
      id: 5,
      category: "skills" as const,
      options: [
        { id: "5a", careers: ["Research Scientist", "Data Scientist", "Financial Analyst"], value: 3 },
        { id: "5b", careers: ["UX Designer", "Marketing Specialist", "Architect"], value: 3 },
        { id: "5c", careers: ["Entrepreneur", "Software Engineer", "Project Manager"], value: 3 },
        { id: "5d", careers: ["Teacher", "Healthcare Professional", "HR Specialist"], value: 3 },
      ],
    },
    {
      id: 6,
      category: "interests" as const,
      options: [
        { id: "6a", careers: ["Healthcare Professional", "Teacher", "Social Worker"], value: 3 },
        { id: "6b", careers: ["Software Engineer", "Product Manager", "Entrepreneur"], value: 3 },
        { id: "6c", careers: ["UX Designer", "Graphic Designer", "Content Writer"], value: 3 },
        { id: "6d", careers: ["Data Scientist", "Research Scientist", "Financial Analyst"], value: 3 },
      ],
    },
  ];
  return questions.find(q => q.id === id);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Career matching endpoint
  app.post("/api/match", async (req, res) => {
    try {
      const validatedData = careerMatchRequestSchema.parse(req.body);
      const topMatches = calculateCareerMatch(validatedData.answers);

      const response: CareerMatchResponse = {
        topMatches: topMatches.slice(0, 5), // Return top 5 matches
      };

      res.json(response);
    } catch (error) {
      console.error("Error in /api/match:", error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  // Save assessment endpoint
  app.post("/api/save-assessment", async (req, res) => {
    try {
      const validatedData = saveAssessmentRequestSchema.parse(req.body);
      
      const assessment = await storage.createAssessment({
        userId: validatedData.userId || null,
        answers: validatedData.answers,
        topCareer: validatedData.topCareer,
        matchScore: validatedData.matchScore,
      });

      res.json({ success: true, assessmentId: assessment.id });
    } catch (error) {
      console.error("Error in /api/save-assessment:", error);
      res.status(400).json({ error: "Failed to save assessment" });
    }
  });

  // Get user's assessment endpoint
  app.get("/api/user-assessment", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "Missing userId parameter" });
      }

      const assessments = await storage.getAssessmentsByUserId(userId);
      
      // Return the first (and should be only) assessment
      if (assessments.length > 0) {
        res.json(assessments[0]);
      } else {
        res.status(404).json({ error: "No assessment found" });
      }
    } catch (error) {
      console.error("Error in /api/user-assessment:", error);
      res.status(400).json({ error: "Failed to fetch assessment" });
    }
  });

  // Track career exploration
  app.post("/api/track-career-exploration", async (req, res) => {
    try {
      const { userId, careerTitle } = req.body;
      
      if (!userId || !careerTitle) {
        return res.status(400).json({ error: "Missing userId or careerTitle" });
      }

      await storage.trackCareerExploration(userId, careerTitle);
      res.json({ success: true });
    } catch (error) {
      console.error("Error in /api/track-career-exploration:", error);
      res.status(400).json({ error: "Failed to track exploration" });
    }
  });

  // Track AR preview
  app.post("/api/track-ar-preview", async (req, res) => {
    try {
      const { userId, careerTitle } = req.body;
      
      if (!userId || !careerTitle) {
        return res.status(400).json({ error: "Missing userId or careerTitle" });
      }

      await storage.trackARPreview(userId, careerTitle);
      res.json({ success: true });
    } catch (error) {
      console.error("Error in /api/track-ar-preview:", error);
      res.status(400).json({ error: "Failed to track AR preview" });
    }
  });

  // Get real-time careers from Gemini based on current trends
  app.get("/api/careers-realtime", async (req, res) => {
    try {
      const realtimeCareers = await fetchRealtimeCareers();
      if (realtimeCareers.length > 0) {
        res.json(realtimeCareers);
      } else {
        res.json(careers);
      }
    } catch (error) {
      console.error("Error in /api/careers-realtime:", error);
      res.json(careers);
    }
  });

  // Get real-time career metrics from Gemini
  app.get("/api/career-metrics/:careerName", async (req, res) => {
    try {
      const { careerName } = req.params;
      const metrics = await fetchCareerMetrics(decodeURIComponent(careerName));
      res.json(metrics);
    } catch (error) {
      console.error("Error in /api/career-metrics:", error);
      res.status(500).json({ error: "Failed to fetch career metrics" });
    }
  });

  // Get platform metrics
  app.get("/api/platform-metrics", async (req, res) => {
    try {
      const metrics = await storage.getPlatformMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error in /api/platform-metrics:", error);
      res.status(400).json({ error: "Failed to fetch metrics" });
    }
  });

  // PDF report generation endpoint
  app.post("/api/report", async (req, res) => {
    try {
      // For now, we'll let the client handle PDF generation
      // This endpoint can be expanded for server-side PDF generation
      res.json({ 
        message: "PDF generation handled client-side",
        success: true 
      });
    } catch (error) {
      console.error("Error in /api/report:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
