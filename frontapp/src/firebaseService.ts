import { db } from './firebase';
import {
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  collection,
  DocumentData,
  CollectionReference,
  deleteDoc
} from 'firebase/firestore';

export interface MoodEntry {
  id?: string;
  mood: number;
  timestamp: Timestamp;
}

export interface ActivityType {
  id?: string;
  name: string;
  icon: string;
  duration: number;
}

export interface UserActivity {
  id?: string;
  userId: string;
  activityTypeId: string;
  completed: boolean;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
}

const moodsCollection = collection(db, 'moods');
const activityTypesCollection = collection(db, 'activityTypes');
const userActivitiesCollection = collection(db, 'userActivities');

export const addMoodEntry = async (userId: string, mood: number) => {
  const userMoodsCollection = collection(db, 'moods', userId, 'entries');
  return await addDoc(userMoodsCollection, {
    mood,
    timestamp: serverTimestamp()
  });
};

export const getMoodEntries = async (userId: string): Promise<MoodEntry[]> => {
  const userMoodsCollection = collection(db, 'moods', userId, 'entries');
  const snapshot = await getDocs(userMoodsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<MoodEntry, 'id'>
  }));
};

export const getActivityTypes = async (): Promise<ActivityType[]> => {
  const snapshot = await getDocs(activityTypesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<ActivityType, 'id'>
  }));
};

export const getUserActivities = async (userId: string): Promise<UserActivity[]> => {
  const q = query(userActivitiesCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<UserActivity, 'id'>
  }));
};

export const addUserActivity = async (userId: string, activityTypeId: string) => {
  return await addDoc(userActivitiesCollection, {
    userId,
    activityTypeId,
    completed: false,
    startTime: null,
    endTime: null
  });
};

export const completeUserActivity = async (activityId: string) => {
  const activityRef = doc(userActivitiesCollection, activityId);
  await updateDoc(activityRef, {
    completed: true,
    endTime: serverTimestamp()
  });
};

export const startUserActivity = async (activityId: string) => {
  const activityRef = doc(userActivitiesCollection, activityId);
  await updateDoc(activityRef, {
    startTime: serverTimestamp()
  });
};

export const createRandomActivitiesForUser = async (userId: string, count: number = 3) => {
  const existingActivities = await getUserActivities(userId);
  for (const activity of existingActivities) {
    if (!activity.completed) {
      await deleteDoc(doc(userActivitiesCollection, activity.id));
    }
  }

  const activityTypes = await getActivityTypes();
  const selectedTypes = activityTypes
    .sort(() => 0.5 - Math.random())
    .slice(0, count);

  for (const activityType of selectedTypes) {
    await addUserActivity(userId, activityType.id!);
  }
};