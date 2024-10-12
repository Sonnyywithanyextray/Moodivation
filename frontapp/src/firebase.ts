import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdqmeNBhW8WL_v5AXlo74Kccs5zxJBGic",
  authDomain: "moodmarathon.firebaseapp.com",
  projectId: "moodmarathon",
  storageBucket: "moodmarathon.appspot.com",
  messagingSenderId: "548474991595",
  appId: "1:548474991595:web:b584df7fb28b8813331fae",
  measurementId: "G-TXCEFRSMC6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const moodsCollection = collection(db, "moods");
const activityTypesCollection = collection(db, "activityTypes");
const userActivitiesCollection = collection(db, "userActivities");

export { auth, db, moodsCollection, activityTypesCollection, userActivitiesCollection };