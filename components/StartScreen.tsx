import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function QuizStartScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.centerBox}>
        <Text style={styles.boxText}>Start Unit 1 Math Level 1</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitButton}>
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEDE9",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  centerBox: {
    backgroundColor: "#fff",
    width: width * 0.85,
    height: height * 0.25,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 60,
  },
  boxText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#027361",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
    paddingHorizontal: 20,
  },
  continueButton: {
    backgroundColor: "#8DA94E",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  exitButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderColor: "#C4C4C4",
    borderWidth: 1,
  },
  exitText: {
    color: "#3A3A3A",
    fontWeight: "700",
    fontSize: 16,
  },
});
