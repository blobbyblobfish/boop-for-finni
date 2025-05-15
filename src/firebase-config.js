import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCwFbpkBEh2Fq7bDI9eLv4HlzgKl_h64Pk",
  authDomain: "boop-for-finni.firebaseapp.com",
  projectId: "boop-for-finni",
  storageBucket: "boop-for-finni.firebasestorage.app",
  messagingSenderId: "386320044980",
  appId: "1:386320044980:web:d0a122eec3e7a6ced7d8e1",
  measurementId: "G-JD0HPZNLG3"
};

const app = initializeApp(firebaseConfig)

// const analytics = getAnalytics(app)

export const auth = getAuth(app)
export const db = getFirestore(app)