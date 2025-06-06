// firebaseConfig.js
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: 'AIzaSyA-89otW10oa6p5knHzVtnH5JsPWSq0eIs',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'think-tank-82fec',
  storageBucket: 'think-tank-82fec.appspot.com',
  messagingSenderId: '938577551494',
  appId: '1:938577551494:ios:d223ac683f3e7af5767107',
  measurementId: 'G-measurement-id',
};

GoogleSignin.configure({
  webClientId: '938577551494-ro5hgdnf2bl1ijjiulaemllc2jdnrm53.apps.googleusercontent.com',
});
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

