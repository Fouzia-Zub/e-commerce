// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from  "firebase/storage"


export const firebaseConfig = {
  apiKey: "AIzaSyAoqpoJMos4ho9KcW8rDiCFdjwzHIPqUGY",
  authDomain: "e-commerce-e2e3b.firebaseapp.com",
  projectId: "e-commerce-e2e3b",
  storageBucket: "e-commerce-e2e3b.appspot.com",
  messagingSenderId: "892484056607",
  appId: "1:892484056607:web:454d2739e7266d849a872a",
  measurementId: "G-NTV4V8C5RF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)