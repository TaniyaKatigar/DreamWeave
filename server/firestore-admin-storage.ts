import admin from "firebase-admin";
import { type User, type InsertUser, type Assessment, type InsertAssessment } from "@shared/schema";

// Initialize Firebase Admin
let adminDb: admin.firestore.Firestore | null = null;

function initializeFirebaseAdmin() {
  try {
    const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_JSON;
    
    if (!serviceAccountJson) {
      console.warn("FIREBASE_ADMIN_SDK_JSON environment variable not set");
      return false;
    }

    const serviceAccount = JSON.parse(serviceAccountJson);
    console.log("Parsed service account, initializing Firebase Admin SDK");

    // Check if already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    }

    adminDb = admin.firestore();
    console.log("✅ Firebase Admin SDK initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Firebase Admin initialization failed:", error);
    return false;
  }
}

// Initialize on module load
initializeFirebaseAdmin();

export class FirestoreAdminStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!adminDb) {
      console.warn("Firestore not initialized");
      return undefined;
    }
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
      const snapshot = await adminDb
        .collection("users")
        .where("firebaseUid", "==", firebaseUid)
        .limit(1)
        .get();
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
    if (!adminDb) throw new Error("Firestore not initialized");
    try {
      const userData = {
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        firebaseUid: user.firebaseUid ?? null,
        createdAt: admin.firestore.Timestamp.now(),
      };
      const userRef = await adminDb.collection("users").add(userData);
      console.log("✅ User created in Firestore:", userRef.id);
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
      const snapshot = await adminDb
        .collection("assessments")
        .where("userId", "==", userId)
        .get();
      
      const assessments = snapshot.docs.map((doc) => {
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
      
      if (assessments.length > 0) {
        console.log(`✅ Retrieved ${assessments.length} assessment(s) for user ${userId}`);
      }
      return assessments;
    } catch (error) {
      console.error("Error getting assessments:", error);
      return [];
    }
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    if (!adminDb) throw new Error("Firestore not initialized");
    try {
      const assessmentData = {
        userId: assessment.userId ?? null,
        answers: assessment.answers,
        topCareer: assessment.topCareer,
        matchScore: assessment.matchScore,
        createdAt: admin.firestore.Timestamp.now(),
      };
      
      const assessmentRef = await adminDb.collection("assessments").add(assessmentData);
      console.log("✅ Assessment saved to Firestore:", assessmentRef.id, "for user:", assessment.userId);
      
      return {
        id: assessmentRef.id,
        ...assessmentData,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("❌ Error creating assessment:", error);
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
      console.log(`✅ Tracked career exploration: ${careerTitle}`);
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
      console.log(`✅ Tracked AR preview: ${careerTitle}`);
    } catch (error) {
      console.error("Error tracking AR preview:", error);
    }
  }

  async getPlatformMetrics(): Promise<any> {
    if (!adminDb) {
      return {
        studentsHelped: 0,
        careersExplored: 0,
        arPreviewsCompleted: 0,
        averageMatchScore: 0,
      };
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

      const uniqueCareers = new Set(
        explorationsSnapshot.docs.map((doc) => doc.data().careerTitle)
      ).size;

      const metrics = {
        studentsHelped: assessmentsSnapshot.size,
        careersExplored: uniqueCareers,
        arPreviewsCompleted: arPreviewsSnapshot.size,
        averageMatchScore: averageScore,
        lastUpdated: new Date(),
      };

      console.log("📊 Platform Metrics:", metrics);
      return metrics;
    } catch (error) {
      console.error("Error getting platform metrics:", error);
      return {
        studentsHelped: 0,
        careersExplored: 0,
        arPreviewsCompleted: 0,
        averageMatchScore: 0,
      };
    }
  }
}

export const firestoreAdminStorage = new FirestoreAdminStorage();
