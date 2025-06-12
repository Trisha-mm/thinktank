import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebaseConfig";

export default function Login() {
  const router = useRouter();
  const { mode } = useLocalSearchParams();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (mode === "signup") {
      setIsSignup(true);
    } else {
      setIsSignup(false);
    }
  }, [mode]);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Please enter both email and password.");
      return;
    }

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      // Save logged-in status
      await AsyncStorage.setItem("isLoggedIn", "true");

      // Show modal
      setModalVisible(true);

      // Wait and navigate
      setTimeout(() => {
        setModalVisible(false);
        router.replace("/tabs");
      }, 1500);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignup ? "Sign Up with Email" : "Log In with Email"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isSignup ? "Sign Up" : "Log In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.toggleText}>
          {isSignup
            ? "Already have an account? Log In"
            : "Don’t have an account? Sign Up"}
        </Text>
      </TouchableOpacity>

      {/* ✅ Success Modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>🎉 {isSignup ? "Sign Up" : "Login"} Successful!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5F2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#144D4D",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#A3C86E",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#144D4D",
    fontWeight: "600",
    fontSize: 16,
  },
  toggleText: {
    color: "#144D4D",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#144D4D",
  },
});
