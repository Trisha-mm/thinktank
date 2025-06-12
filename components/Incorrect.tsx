
        import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AnswerFeedback() {
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        
        <Text style={styles.incorrectText}>Incorrect</Text>
        <Text style={styles.correctAnswerText}>
          Correct Answer: <Text style={styles.correctAnswer}>Paris</Text>
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  correctText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#027361",
    marginBottom: 20,
  },
  incorrectText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#D23F3F",
    marginBottom: 8,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  correctAnswer: {
    fontWeight: "700",
    color: "#3A3A3A",
  },
  button: {
    backgroundColor: "#8DA94E",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
