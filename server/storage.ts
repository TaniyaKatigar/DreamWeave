import { type User, type InsertUser, type Assessment, type InsertAssessment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAssessment(id: string): Promise<Assessment | undefined>;
  getAssessmentsByUserId(userId: string): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
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
}

// Use Firestore storage by default if Firebase is configured, otherwise fall back to in-memory
let storage: IStorage;
try {
  const { firestoreStorage } = require("./firestore-storage");
  storage = firestoreStorage;
} catch (error) {
  console.warn("Firestore not available, using in-memory storage");
  storage = new MemStorage();
}

export { storage };
