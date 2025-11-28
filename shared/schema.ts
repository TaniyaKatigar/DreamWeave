import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  firebaseUid: text("firebase_uid").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Career assessments table to store quiz results
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  answers: jsonb("answers").notNull().$type<QuizAnswer[]>(),
  topCareer: text("top_career").notNull(),
  matchScore: integer("match_score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  displayName: true,
  photoURL: true,
  firebaseUid: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Quiz question and answer types
export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  category: "personality" | "skills" | "interests";
}

export interface QuizOption {
  id: string;
  text: string;
  value: number;
  careers: string[];
}

export interface QuizAnswer {
  questionId: number;
  selectedOption: string;
  value: number;
}

// Career data types
export interface Career {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  growthPotential: number; // 0-100
  stressIndex: number; // 0-100
  mismatchProbability: number; // 0-100
  requiredSkills: string[];
  personalityTraits: string[];
  arModelPath?: string;
  videoFallbackPath?: string;
  industryTrends: string;
  workspace3dModel?: string;
}

// Career match result
export interface CareerMatchResult {
  career: Career;
  matchScore: number;
  breakdown: {
    personalityMatch: number;
    skillsMatch: number;
    interestsMatch: number;
  };
}

// API request/response types
export const careerMatchRequestSchema = z.object({
  answers: z.array(z.object({
    questionId: z.number(),
    selectedOption: z.string(),
    value: z.number(),
  })),
});

export type CareerMatchRequest = z.infer<typeof careerMatchRequestSchema>;

export interface CareerMatchResponse {
  topMatches: CareerMatchResult[];
  userId?: string;
}

export const saveAssessmentRequestSchema = z.object({
  userId: z.string().optional(),
  answers: z.array(z.object({
    questionId: z.number(),
    selectedOption: z.string(),
    value: z.number(),
  })),
  topCareer: z.string(),
  matchScore: z.number(),
});

export type SaveAssessmentRequest = z.infer<typeof saveAssessmentRequestSchema>;
