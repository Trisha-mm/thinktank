import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-89otW10oa6p5knHzVtnH5JsPWSq0eIs",
  authDomain: "think-tank-82fec.firebaseapp.com",
  projectId: "think-tank-82fec",
  storageBucket: "think-tank-82fec.firebasestorage.app",
  messagingSenderId: "938577551494",
  appId: "1:938577551494:web:69ceb8e3dfa383b1767107",
  measurementId: "G-GD68YB1H76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;