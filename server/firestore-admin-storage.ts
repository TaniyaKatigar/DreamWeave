import * as admin from "firebase-admin";
import { type User, type InsertUser, type Assessment, type InsertAssessment } from "@shared/schema";

// Initialize Firebase Admin
let adminApp: admin.app.App | null = null;
let adminDb: admin.firestore.Firestore | null = null;

try {
  const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_JSON;
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    adminDb = admin.firestore();
    console.log("Firebase Admin initialized successfully");
  }
} catch (error) {
  console.warn("Firebase Admin initialization failed:", error);
}

export class FirestoreAdminStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!adminDb) return undefined;
    try {
      const userDoc = await adminDb.collection("users").doc(id).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          email: data?.email ?? null,
          displayName: data?.displayName ?? null,
          photoURL: data?.photoURL ?? null,
          firebaseUid: data?.firebaseUid ?? null,
          createdAt: data?.createdAt?.toDate() ?? new Date(),
        };
      }
    } catch (error) {
      console.error("Error getting user:", error);
    }
    return undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    if (!adminDb) return undefined;
    try {
      const snapshot = await adminDb.collection("users").where("firebaseUid", "==", firebaseUid).limit(1).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email ?? null,
          displayName: data.displayName ?? null,
          photoURL: data.photoURL ?? null,
          firebaseUid: data.firebaseUid ?? null,
          createdAt: data.createdAt?.toDate() ?? new Date(),
        };
      }
    } catch (error) {
      console.error("Error getting user by Firebase UID:", error);
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    if (!adminDb) throw new Error("Firebase Admin not initialized");
    try {
      const userData = {
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        firebaseUid: user.firebaseUid ?? null,
        createdAt: admin.firestore.Timestamp.now(),
      };
      const userRef = await adminDb.collection("users").add(userData);
      return {
        id: userRef.id,
        ...userData,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    if (!adminDb) return undefined;
    try {
      const assessmentDoc = await adminDb.collection("assessments").doc(id).get();
      if (assessmentDoc.exists) {
        const data = assessmentDoc.data();
        return {
          id: assessmentDoc.id,
          userId: data?.userId ?? null,
          answers: data?.answers,
          topCareer: data?.topCareer,
          matchScore: data?.matchScore,
          createdAt: data?.createdAt?.toDate() ?? new Date(),
        };
      }
    } catch (error) {
      console.error("Error getting assessment:", error);
    }
    return undefined;
  }

  async getAssessmentsByUserId(userId: string): Promise<Assessment[]> {
    if (!adminDb) return [];
    try {
      const snapshot = await adminDb.collection("assessments").where("userId", "==", userId).get();
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId ?? null,
          answers: data.answers,
          topCareer: data.topCareer,
          matchScore: data.matchScore,
          createdAt: data.createdAt?.toDate() ?? new Date(),
        };
      });
    } catch (error) {
      console.error("Error getting assessments:", error);
      return [];
    }
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    if (!adminDb) throw new Error("Firebase Admin not initialized");
    try {
      const assessmentData = {
        userId: assessment.userId ?? null,
        answers: assessment.answers,
        topCareer: assessment.topCareer,
        matchScore: assessment.matchScore,
        createdAt: admin.firestore.Timestamp.now(),
      };
      const assessmentRef = await adminDb.collection("assessments").add(assessmentData);
      return {
        id: assessmentRef.id,
        ...assessmentData,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Error creating assessment:", error);
      throw error;
    }
  }

  async trackCareerExploration(userId: string, careerTitle: string): Promise<void> {
    if (!adminDb) return;
    try {
      const explorationData = {
        userId,
        careerTitle,
        timestamp: admin.firestore.Timestamp.now(),
      };
      await adminDb.collection("careerExplorations").add(explorationData);
    } catch (error) {
      console.error("Error tracking career exploration:", error);
    }
  }

  async trackARPreview(userId: string, careerTitle: string): Promise<void> {
    if (!adminDb) return;
    try {
      const arData = {
        userId,
        careerTitle,
        timestamp: admin.firestore.Timestamp.now(),
      };
      await adminDb.collection("arPreviews").add(arData);
    } catch (error) {
      console.error("Error tracking AR preview:", error);
    }
  }

  async getPlatformMetrics(): Promise<any> {
    if (!adminDb) {
      return { studentsHelped: 0, careersExplored: 0, arPreviewsCompleted: 0, averageMatchScore: 0 };
    }
    try {
      const assessmentsSnapshot = await adminDb.collection("assessments").get();
      const explorationsSnapshot = await adminDb.collection("careerExplorations").get();
      const arPreviewsSnapshot = await adminDb.collection("arPreviews").get();

      const assessments = assessmentsSnapshot.docs.map((doc) => doc.data());
      const averageScore =
        assessments.length > 0
          ? Math.round(assessments.reduce((sum, a) => sum + a.matchScore, 0) / assessments.length)
          : 0;

      const uniqueCareers = new Set(explorationsSnapshot.docs.map((doc) => doc.data().careerTitle)).size;

      return {
        studentsHelped: assessmentsSnapshot.size,
        careersExplored: uniqueCareers,
        arPreviewsCompleted: arPreviewsSnapshot.size,
        averageMatchScore: averageScore,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error("Error getting platform metrics:", error);
      return { studentsHelped: 0, careersExplored: 0, arPreviewsCompleted: 0, averageMatchScore: 0 };
    }
  }
}

export const firestoreAdminStorage = new FirestoreAdminStorage();
