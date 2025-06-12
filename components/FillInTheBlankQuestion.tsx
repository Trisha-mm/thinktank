import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function QuizFillInBlankScreen() {
  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      {/* Time and Money */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>⏱ 14s left</Text>
        <Text style={styles.infoText}>💰 $200</Text>
      </View>

      {/* Prompt */}
      <Text style={styles.prompt}>Fill in the blank</Text>

      {/* Question Card */}
      <View style={styles.questionBox}>
        <Text style={styles.questionText}>
          The capital of France is _____.
        </Text>
      </View>

      {/* Answer Choices */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>London</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Paris</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Rome</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Berlin</Text>
        </TouchableOpacity>
      </View>
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
    width: "40%", // Hardcoded for now
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
    padding: 20,
    marginBottom: 30,
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
  optionsContainer: {
    gap: 14,
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3A3A3A",
  },
});
