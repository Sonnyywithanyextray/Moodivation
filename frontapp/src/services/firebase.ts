// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Add this import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdqmeNBhW8WL_v5AXlo74Kccs5zxJBGic",
  authDomain: "moodmarathon.firebaseapp.com",
  projectId: "moodmarathon",
  storageBucket: "moodmarathon.appspot.com",
  messagingSenderId: "548474991595",
  appId: "1:548474991595:web:b584df7fb28b8813331fae",
  measurementId: "G-TXCEFRSMC6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication

// Export the auth object
export { auth };