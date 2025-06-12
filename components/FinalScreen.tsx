// components/FinalScreen.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FinalScreen({
  score,
  money,
}: {
  score: number;
  money: number;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Quiz Complete!</Text>
      <Text style={styles.text}>You got {score} correct answers</Text>
      <Text style={styles.text}>You earned ${money}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEDE9",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3A3A3A",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#8DA94E",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
