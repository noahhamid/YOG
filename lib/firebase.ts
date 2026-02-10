// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMW0PWCGpzitxXk7ZtakiuD_IhjyF6jIg",
  authDomain: "yogg-36a3c.firebaseapp.com",
  projectId: "yogg-36a3c",
  storageBucket: "yogg-36a3c.firebasestorage.app",
  messagingSenderId: "465042135661",
  appId: "1:465042135661:web:453f6de3172d7414ec7d64"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };