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
}

export const firestoreStorage = new FirestoreStorage();
