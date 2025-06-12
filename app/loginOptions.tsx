import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const WEB_CLIENT_ID =
  "938577551494-of1jd4nk2cc7fq00cjtr60l2augjsrdh.apps.googleusercontent.com";

WebBrowser.maybeCompleteAuthSession();

export default function LoginOptionsScreen() {
  const { mode } = useLocalSearchParams();
  const router = useRouter();
  const isSignup = mode === "signup";
  let emailText = "Log In with Email";
  let googleText = "Log In with Google";

  if (isSignup) {
    emailText = "Sign Up with Email";
    googleText = "Sign Up with Google";
  }

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    androidClientId: WEB_CLIENT_ID,
    iosClientId: WEB_CLIENT_ID,
    redirectUri: "https://auth.expo.io/@shubhambade/think-tank",
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      const { idToken } = response.authentication;

      if (idToken) {
        const credential = GoogleAuthProvider.credential(idToken);

        signInWithCredential(auth, credential)
          .then(async (userCredential) => {
            const user = userCredential.user;
            console.log("✅ Logged in as:", user.displayName);

            await AsyncStorage.setItem("isLoggedIn", "true");
            router.replace("./tabs");
          })
          .catch((err) => {
            console.error("❌ Firebase login failed:", err);
          });
      }
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Think Tank</Text>
      <Text style={styles.subheader}>
        {isSignup ? "Create your account" : "Welcome back"}
      </Text>
      <View style={styles.buttonContainer}>
        <Link href={{ pathname: "/login", params: { mode } }} asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{emailText}</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          style={styles.googleButton}
          disabled={!request}
          onPress={() => promptAsync({ useProxy: false })}
        >
          <Text style={styles.googleButtonText}>{googleText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5F2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 34,
    fontWeight: "800",
    color: "#144D4D",
    marginBottom: 8,
  },
  subheader: {
    fontSize: 18,
    color: "#5A5A5A",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    gap: 18,
  },
  primaryButton: {
    backgroundColor: "#A3C86E",
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    textAlign: "center",
    color: "#144D4D",
    fontWeight: "700",
    fontSize: 17,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#A3C86E",
    paddingVertical: 16,
    borderRadius: 12,
  },
  googleButtonText: {
    textAlign: "center",
    color: "#144D4D",
    fontWeight: "600",
    fontSize: 17,
  },
});
