import { type User, type InsertUser, type Assessment, type InsertAssessment } from "@shared/schema";
import { randomUUID } from "crypto";
import { firestoreAdminStorage } from "./firestore-admin-storage";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAssessment(id: string): Promise<Assessment | undefined>;
  getAssessmentsByUserId(userId: string): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  
  trackCareerExploration(userId: string, careerTitle: string): Promise<void>;
  trackARPreview(userId: string, careerTitle: string): Promise<void>;
  getPlatformMetrics(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private assessments: Map<string, Assessment>;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      email: insertUser.email ?? null,
      displayName: insertUser.displayName ?? null,
      photoURL: insertUser.photoURL ?? null,
      firebaseUid: insertUser.firebaseUid ?? null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getAssessmentsByUserId(userId: string): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(
      (assessment) => assessment.userId === userId,
    );
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = randomUUID();
    const assessment: Assessment = {
      id,
      userId: insertAssessment.userId ?? null,
      answers: insertAssessment.answers as any,
      topCareer: insertAssessment.topCareer,
      matchScore: insertAssessment.matchScore,
      createdAt: new Date(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async trackCareerExploration(userId: string, careerTitle: string): Promise<void> {
    // In-memory storage doesn't persist tracking data
    console.log(`Tracked career exploration: ${userId} - ${careerTitle}`);
  }

  async trackARPreview(userId: string, careerTitle: string): Promise<void> {
    // In-memory storage doesn't persist tracking data
    console.log(`Tracked AR preview: ${userId} - ${careerTitle}`);
  }

  async getPlatformMetrics(): Promise<any> {
    const assessments = Array.from(this.assessments.values());
    const averageScore = assessments.length > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + a.matchScore, 0) / assessments.length)
      : 0;

    return {
      studentsHelped: assessments.length,
      careersExplored: 0,
      arPreviewsCompleted: 0,
      averageMatchScore: averageScore,
      lastUpdated: new Date(),
    };
  }
}

// Use Firebase Admin Firestore first, then fall back to in-memory
let storage: IStorage;
try {
  if (process.env.FIREBASE_ADMIN_SDK_JSON) {
    storage = firestoreAdminStorage;
  } else {
    console.warn("FIREBASE_ADMIN_SDK_JSON not set, using in-memory storage");
    storage = new MemStorage();
  }
} catch (error) {
  console.warn("Firebase Admin not available, using in-memory storage:", error);
  storage = new MemStorage();
}

export { storage };
