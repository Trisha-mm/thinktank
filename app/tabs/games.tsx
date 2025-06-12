import LogoHeader from "@/components/LogoHeader";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type Question = {
  question: string;
  options: string[];
  correct: string;
  type: "multiple-choice" | "fill-in-blank";
};

const QUESTION_DATABASE: Record<string, any> = { 
    Math: {
      "Unit 1": {
        "1": [
          {
            question: "What is 5 + 3?",
            options: ["6", "8", "7", "9"],
            correct: "8",
            type: "multiple-choice",
          },
          {
            question: "What is 10 - 4?",
            options: ["5", "6", "7", "8"],
            correct: "6",
            type: "multiple-choice",
          },
        ],
        "2": [
          {
            question: "What is 12 × 3?",
            options: ["35", "36", "34", "37"],
            correct: "36",
            type: "multiple-choice",
          },
          {
            question: "What is 48 ÷ 6?",
            options: ["7", "8", "9", "6"],
            correct: "8",
            type: "multiple-choice",
          },
        ],
        "3": [
          {
            question: "Solve for x: 2x + 5 = 15",
            options: ["3", "4", "5", "6"],
            correct: "5",
            type: "multiple-choice",
          },
        ],
      },
      "Unit 2": {
        "1": [
          {
            question:
              "What is the area of a rectangle with length 6 and width 4?",
            options: ["20", "24", "22", "26"],
            correct: "24",
            type: "multiple-choice",
          },
        ],
      },
    },
    English: {
      "Unit 1": {
        "1": [
          {
            question: "Which word is a noun?",
            options: ["Run", "Happy", "Dog", "Quickly"],
            correct: "Dog",
            type: "multiple-choice",
          },
          {
            question: "What is the past tense of 'go'?",
            options: ["Goes", "Going", "Went", "Gone"],
            correct: "Went",
            type: "multiple-choice",
          },
        ],
        "2": [
          {
            question:
              "Complete the sentence: 'She _____ to the store yesterday.'",
            options: ["go", "goes", "went", "going"],
            correct: "went",
            type: "fill-in-blank",
          },
        ],
      },
    },
    Science: {
      "Unit 1": {
        "1": [
          {
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2", "NaCl"],
            correct: "H2O",
            type: "multiple-choice",
          },
          {
            question: "How many planets are in our solar system?",
            options: ["7", "8", "9", "10"],
            correct: "8",
            type: "multiple-choice",
          },
        ],
      },
    },
    "Social Studies": {
      "Unit 1": {
        "1": [
          {
            question: "What is the capital of France?",
            options: ["London", "Paris", "Rome", "Berlin"],
            correct: "Paris",
            type: "multiple-choice",
          },
          {
            question: "Who was the first President of the United States?",
            options: [
              "Thomas Jefferson",
              "George Washington",
              "John Adams",
              "Benjamin Franklin",
            ],
            correct: "George Washington",
            type: "multiple-choice",
          },
        ],
      },
    },
  };
  

export default function QuizGame() {
  const { subject, unit, level } = useLocalSearchParams<{
    subject?: string;
    unit?: string;
    level?: string;
  }>();

  const [screen, setScreen] = useState<"start" | "quiz" | "end">("start");
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  useEffect(() => {
    if (subject && unit && level) {
      const questionSet: Question[] = QUESTION_DATABASE[subject]?.[unit]?.[level] ?? [];
      if (questionSet.length > 0) {
        const shuffled = [...questionSet].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
      } else {
        setQuestions([
          {
            question: `Sample ${subject} question for ${unit}, Level ${level}`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct: "Option A",
            type: "multiple-choice",
          },
        ]);
      }
    }
  }, [subject, unit, level]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (screen === "quiz" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (screen === "quiz" && timeLeft === 0) {
      setShowFeedback("incorrect");
    }
    return () => clearTimeout(timer);
  }, [timeLeft, screen]);

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = questions.length > 0
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion?.correct) {
      setScore(score + 10);
      setShowFeedback("correct");
    } else {
      setShowFeedback("incorrect");
    }
  };

  const handleContinue = () => {
    setShowFeedback(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
      setSelectedAnswer("");
    } else {
      setScreen("end");
    }
  };

  const resetGame = () => {
    setScreen("start");
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(30);
    setSelectedAnswer("");
    setShowFeedback(null);
  };

  const renderStart = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Ready to start?</Text>
      <Text style={styles.subtitle}>
        {subject} - {unit} - Level {level}
      </Text>
      <Text style={styles.subtitle}>You’ll earn $10 for every correct answer!</Text>
      <Text style={styles.questionCount}>
        {questions.length} question{questions.length !== 1 ? "s" : ""} waiting
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => setScreen("quiz")}>
        <Text style={styles.buttonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuiz = () => {
    if (!currentQuestion) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.title}>No questions available</Text>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.quizContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>⏱ {timeLeft}s</Text>
          <Text style={styles.infoText}>💰 ${score}</Text>
          <Text style={styles.infoText}>{currentQuestionIndex + 1}/{questions.length}</Text>
        </View>
        <Text style={styles.prompt}>
          {currentQuestion.type === "fill-in-blank"
            ? "Fill in the blank"
            : "Choose the correct answer"}
        </Text>
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectText}>
            {subject} • {unit} • Level {level}
          </Text>
        </View>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selectedAnswer === option && styles.selectedOption,
              ]}
              onPress={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderEnd = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>You finished!</Text>
      <Text style={styles.subtitle}>
        {subject} - {unit} - Level {level}
      </Text>
      <Text style={styles.score}> ${score} earned</Text>
      <Text style={styles.accuracy}>
        {Math.round((score / (questions.length * 10)) * 100)}% accuracy
      </Text>
      <TouchableOpacity style={styles.button} onPress={resetGame}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFeedback = () => {
    if (!showFeedback || !currentQuestion) return null;
    const isCorrect = showFeedback === "correct";
    return (
      <Modal transparent animationType="fade" visible>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            {isCorrect ? (
              <Text style={styles.correctText}>Correct! +$10 </Text>
            ) : (
              <>
                <Text style={styles.incorrectText}>Oops! That was wrong</Text>
                <Text style={styles.correctAnswerText}>
                  The correct answer is{" "}
                  <Text style={styles.correctAnswer}>{currentQuestion.correct}</Text>
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
       <View style={styles.logoWrapper}>
        <LogoHeader />
      </View>
      {screen === "start" && renderStart()}
      {screen === "quiz" && renderQuiz()}
      {screen === "end" && renderEnd()}
      {renderFeedback()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEEDE9" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logoWrapper: {
    marginHorizontal: -30,
    marginTop: 0,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#027361",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3A3A3A",
    marginBottom: 12,
    textAlign: "center",
  },
  questionCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8DA94E",
    marginBottom: 40,
    textAlign: "center",
  },
  score: {
    fontSize: 24,
    fontWeight: "700",
    color: "#8DA94E",
    marginBottom: 12,
  },
  accuracy: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3A3A3A",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#8DA94E",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

 
  quizContainer: {
    flex: 1,
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
    height: "100%",
    backgroundColor: "#B3D49B",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
    marginBottom: 8,
  },
  subjectInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8DA94E",
    backgroundColor: "rgba(141, 169, 78, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
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
    lineHeight: 28,
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
  selectedOption: {
    backgroundColor: "#8DA94E",
    borderColor: "#8DA94E",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3A3A3A",
  },
  selectedOptionText: {
    color: "#fff",
  },

  overlay: {
    flex: 1,
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
    textAlign: "center",
  },
  incorrectText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#D23F3F",
    marginBottom: 8,
    textAlign: "center",
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
    color: "#027361",
  },
});


























