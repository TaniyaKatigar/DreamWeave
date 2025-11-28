import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  query, 
  where,
  addDoc,
  Timestamp,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../client/src/lib/firebase";
import { type User, type InsertUser, type Assessment, type InsertAssessment } from "@shared/schema";

export class FirestoreStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const userDoc = await getDoc(doc(db, "users", id));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          email: data.email ?? null,
          displayName: data.displayName ?? null,
          photoURL: data.photoURL ?? null,
          firebaseUid: data.firebaseUid ?? null,
          createdAt: data.createdAt?.toDate() ?? new Date(),
        };
      }
    } catch (error) {
      console.error("Error getting user:", error);
    }
    return undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    try {
      const q = query(collection(db, "users"), where("firebaseUid", "==", firebaseUid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
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
    try {
      const userData = {
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        firebaseUid: user.firebaseUid ?? null,
        createdAt: Timestamp.now(),
      };
      const userRef = await addDoc(collection(db, "users"), userData);
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
    try {
      const assessmentDoc = await getDoc(doc(db, "assessments", id));
      if (assessmentDoc.exists()) {
        const data = assessmentDoc.data();
        return {
          id: assessmentDoc.id,
          userId: data.userId ?? null,
          answers: data.answers,
          topCareer: data.topCareer,
          matchScore: data.matchScore,
          createdAt: data.createdAt?.toDate() ?? new Date(),
        };
      }
    } catch (error) {
      console.error("Error getting assessment:", error);
    }
    return undefined;
  }

  async getAssessmentsByUserId(userId: string): Promise<Assessment[]> {
    try {
      const q = query(collection(db, "assessments"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
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
    try {
      const assessmentData = {
        userId: assessment.userId ?? null,
        answers: assessment.answers,
        topCareer: assessment.topCareer,
        matchScore: assessment.matchScore,
        createdAt: Timestamp.now(),
      };
      const assessmentRef = await addDoc(collection(db, "assessments"), assessmentData);
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
    try {
      const explorationData = {
        userId,
        careerTitle,
        timestamp: Timestamp.now(),
      };
      await addDoc(collection(db, "careerExplorations"), explorationData);
    } catch (error) {
      console.error("Error tracking career exploration:", error);
    }
  }

  async trackARPreview(userId: string, careerTitle: string): Promise<void> {
    try {
      const arData = {
        userId,
        careerTitle,
        timestamp: Timestamp.now(),
      };
      await addDoc(collection(db, "arPreviews"), arData);
    } catch (error) {
      console.error("Error tracking AR preview:", error);
    }
  }

  async getPlatformMetrics(): Promise<any> {
    try {
      const assessmentsSnapshot = await getDocs(collection(db, "assessments"));
      const explorationsSnapshot = await getDocs(collection(db, "careerExplorations"));
      const arPreviewsSnapshot = await getDocs(collection(db, "arPreviews"));
      
      const assessments = assessmentsSnapshot.docs.map(doc => doc.data());
      const averageScore = assessments.length > 0 
        ? Math.round(assessments.reduce((sum, a) => sum + a.matchScore, 0) / assessments.length)
        : 0;

      const uniqueCareers = new Set(explorationsSnapshot.docs.map(doc => doc.data().careerTitle)).size;

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

export const firestoreStorage = new FirestoreStorage();
