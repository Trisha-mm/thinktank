import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
    GoogleAuthProvider,
    signInWithCredential,
    signOut,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

export class GoogleAuthService {
  static async signInWithGoogle() {
    try {
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();

      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();

      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);

      // Sign in with Firebase
      const result = await signInWithCredential(auth, googleCredential);

      return {
        success: true,
        user: result.user,
      };
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async signOut() {
    try {
      // Sign out from Google
      await GoogleSignin.signOut();

      // Sign out from Firebase
      await signOut(auth);

      return { success: true };
    } catch (error) {
      console.error("Sign-Out Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      return userInfo;
    } catch (error) {
      console.error("Get Current User Error:", error);
      return null;
    }
  }
}
