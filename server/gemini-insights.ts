import { GoogleGenAI } from "@google/genai";

// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
// - do not change this unless explicitly requested by the user

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CareerInsight {
  title: string;
  insight: string;
  recommendation: string;
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
