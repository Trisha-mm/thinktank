import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function QuizShortAnswerScreen() {
  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      {/* Time and Money */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>⏱ 11s left</Text>
        <Text style={styles.infoText}>💰 $230</Text>
      </View>

      {/* Prompt */}
      <Text style={styles.prompt}>Short Answer</Text>

      {/* Question Box */}
      <View style={styles.questionBox}>
        <Text style={styles.questionText}>
          What is the largest planet in our solar system?
        </Text>
      </View>

      {/* Answer Input */}
      <TextInput
        style={styles.textInput}
        placeholder="Type your answer here..."
        placeholderTextColor="#999"
      />

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEDE9",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#DADADA",
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: "#B3D49B",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3A3A3A",
  },
  prompt: {
    fontSize: 18,
    fontWeight: "700",
    color: "#027361",
    textAlign: "center",
    marginBottom: 16,
  },
  questionBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3A3A3A",
    textAlign: "center",
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    padding: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#3A3A3A",
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: "#8DA94E",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  continueText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
