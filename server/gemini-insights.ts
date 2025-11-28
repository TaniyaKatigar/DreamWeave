import { GoogleGenAI } from "@google/genai";
import type { Career } from "@shared/schema";

// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
// - do not change this unless explicitly requested by the user

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CareerInsight {
  title: string;
  insight: string;
  recommendation: string;
}

export async function fetchRealtimeCareers(): Promise<Career[]> {
  try {
    const prompt = `You are a career data expert. Provide current, real-time career information based on 2025 market trends. Return a JSON array of 8 career objects with the following structure:

[
  {
    "id": "unique-id",
    "title": "Career Title",
    "description": "Brief description (1 sentence)",
    "category": "Category",
    "salaryRange": {"min": 500000, "max": 2000000, "currency": "INR"},
    "growthPotential": 85,
    "stressIndex": 65,
    "mismatchProbability": 20,
    "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
    "personalityTraits": ["Trait 1", "Trait 2"],
    "industryTrends": "Current trends and 2025 outlook"
  }
]

Include these careers: Software Engineer, UX Designer, Data Scientist, Healthcare Professional, Teacher, Product Manager, AI/ML Engineer, Cloud Architect. Make values realistic based on 2025 market conditions.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text || "[]";
    // Extract JSON from the response
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : "[]";
    const careers = JSON.parse(jsonStr) as Career[];
    
    console.log("✅ Fetched real-time career data from Gemini");
    return careers;
  } catch (error) {
    console.error("Error fetching real-time careers from Gemini:", error);
    return [];
  }
}

export async function generateCareerInsights(
  careerTitle: string,
  matchScore: number,
  growthPotential: number,
  stressIndex: number,
  salaryRange: { min: number; max: number }
): Promise<CareerInsight> {
  try {
    const prompt = `You are a career counselor analyzing career statistics. Generate insights based on the following data:

Career: ${careerTitle}
Match Score: ${matchScore}%
Growth Potential: ${growthPotential}%
Stress Index: ${stressIndex}%
Salary Range: ₹${(salaryRange.min / 100000).toFixed(1)}L - ₹${(salaryRange.max / 100000).toFixed(1)}L

Provide:
1. A concise title for the insight (max 10 words)
2. A detailed insight about this career (2-3 sentences)
3. A specific recommendation for the student (2-3 sentences)

Format as JSON:
{"title": "...", "insight": "...", "recommendation": "..."}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text || "{}";
    const parsed = JSON.parse(rawText);
    
    return {
      title: parsed.title || "Career Insight",
      insight: parsed.insight || "This career offers excellent opportunities for growth and development.",
      recommendation: parsed.recommendation || "Consider developing additional skills to enhance your career prospects."
    };
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return {
      title: "Career Opportunity",
      insight: "This career path aligns well with your profile and offers promising growth potential.",
      recommendation: "Focus on continuous skill development and industry certifications to maximize your career growth."
    };
  }
}
