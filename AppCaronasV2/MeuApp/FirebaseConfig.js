// Import the functions you need from the SDK
import { initializeApp } from "@firebase/app";
import { getAuth } from '@firebase/auth';
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAh-QTwPeNfZOx2DNiSJEkdtcWqEio0my4",
  authDomain: "appcaronas-c2505.firebaseapp.com",
  projectId: "appcaronas-c2505",
  storageBucket: "appcaronas-c2505.firebasestorage.app",
  messagingSenderId: "134640904600",
  appId: "1:134640904600:web:f232a5b82730e9586ce3ed",
  measurementId: "G-JMZNDW6XTJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {auth, db}