import LogoHeader from "@/components/LogoHeader";
import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

type Lesson = {
  id: string;
  finished: boolean;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showStars, setShowStars] = useState(false);

  const fetchLessons = async () => {
    if (!subject) return;

    try {
      const lessonsSnapshot = await getDocs(
        collection(db, "subjects", subject, "lessons")
      );

      const fetchedLessons: Lesson[] = [];
      lessonsSnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedLessons.push({
          id: doc.id,
          finished: data.finished || false,
        });
      });

      setLessons(fetchedLessons);
    } catch (err) {
      console.error("Error fetching lessons:", err);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!subject || !unit || !level) {
        setError("Missing required parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        await fetchLessons();

      
        const questionsSnapshot = await getDocs(
          collection(db, "subjects", subject, "lessons", level, "questions")
        );

        if (questionsSnapshot.empty) {
          setError(`No questions found for ${subject} - ${level}`);
          setLoading(false);
          return;
        }

        const fetchedQuestions: Question[] = [];
        questionsSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedQuestions.push({
            id: doc.id,
            question: data.question || "No question text",
            options: data.options || [],
            answer: data.answer || "",
          });
        });


        const shuffledQuestions = [...fetchedQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
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
    if (answer === currentQuestion?.answer) {
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

      const perfectScore = questions.length * 10;
      const isPerfectScore = score === perfectScore;
      
      if (isPerfectScore) {
        markLessonAsFinished();
      }
      
      setScreen("end");
    }
  };

  const markLessonAsFinished = async () => {
    if (!subject || !level) return;

    try {
      const lessonRef = doc(db, "subjects", subject, "lessons", level);
      await updateDoc(lessonRef, {
        finished: true,
      });
      console.log("Lesson marked as finished");
      

      setLessons(prev => 
        prev.map(lesson => 
          lesson.id === level 
            ? { ...lesson, finished: true }
            : lesson
        )
      );
      

      setShowStars(true);
      
    } catch (error) {
      console.error("Error marking lesson as finished:", error);
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


  const isPerfectScore = () => {
    const perfectScore = questions.length * 10;
    return score === perfectScore;
  };

  const StarWithOverlay = ({ lessonId, style }: { lessonId: string, style?: any }) => {
    const isFinished = lessons.find(lesson => lesson.id === lessonId)?.finished || false;
    
    return (
      <View style={[styles.starContainer, style]}>
        <Image 
          source={require("@/assets/images/star.png")} 
          style={styles.starImage}
          resizeMode="contain"
        />
        {isFinished && (
          <View style={styles.yellowOverlay} />
        )}
      </View>
    );
  };

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#8DA94E" />
      <Text style={styles.loadingText}>Loading questions...</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>⚠️ {error}</Text>
      <TouchableOpacity style={styles.button} onPress={() => {
        setError(null);
        setLoading(true);
      
        const retryFetch = async () => {
          if (!subject || !unit || !level) return;
          try {
            await fetchLessons();
            const questionsSnapshot = await getDocs(
              collection(db, "subjects", subject, "lessons", level, "questions")
            );
            const fetchedQuestions: Question[] = [];
            questionsSnapshot.forEach((doc) => {
              const data = doc.data();
              fetchedQuestions.push({
                id: doc.id,
                question: data.question || "No question text",
                options: data.options || [],
                answer: data.answer || "",
              });
            });
            setQuestions(fetchedQuestions.sort(() => Math.random() - 0.5));
          } catch (err) {
            setError("Failed to load questions. Please try again.");
          } finally {
            setLoading(false);
          }
        };
        retryFetch();
      }}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStart = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Ready to start?</Text>
      <Text style={styles.subtitle}>
      {`${subject?.charAt(0).toUpperCase()}${subject?.slice(1)} - ${level}`}
      </Text>
      <Text style={styles.subtitle}>You'll earn $10 for every correct answer!</Text>
      <Text style={styles.completionRequirement}>
        Get all questions right to complete the lesson!
      </Text>
      <Text style={styles.questionCount}>
        {questions.length} question{questions.length !== 1 ? "s" : ""} waiting
      </Text>
      
      {}
      <View style={styles.starsContainer}>
        {['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5'].map((lessonId, index) => (
          <StarWithOverlay 
            key={lessonId} 
            lessonId={lessonId}
            style={{ marginHorizontal: 8 }}
          />
        ))}
      </View>
      
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
        <Text style={styles.prompt}>Choose the correct answer</Text>
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectText}>
          {`${subject?.charAt(0).toUpperCase()}${subject?.slice(1)} • ${level}`}
          </Text>
        </View>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={`${currentQuestion.id}-${index}`}
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
      {isPerfectScore() ? (
        <>
          <Text style={styles.title}>🎉 Congratulations!</Text>
          <Text style={styles.subtitle}>
            You completed {`${subject?.charAt(0).toUpperCase()}${subject?.slice(1)} - ${level}`}
          </Text>
          <Text style={styles.completionMessage}>Perfect score! Lesson unlocked!</Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Quiz Finished!</Text>
          <Text style={styles.subtitle}>
          {`${subject?.charAt(0).toUpperCase()}${subject?.slice(1)} - ${level}`}
          </Text>
          <Text style={styles.incompleteMessage}>
            You need a perfect score to complete the lesson. Try again!
          </Text>
        </>
      )}
      
      <Text style={styles.score}>💰 ${score} earned</Text>
      <Text style={styles.accuracy}>
        {Math.round((score / (questions.length * 10)) * 100)}% accuracy
      </Text>
      
      {}
      <View style={styles.starsContainer}>
        {['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5'].map((lessonId, index) => (
          <StarWithOverlay 
            key={lessonId} 
            lessonId={lessonId}
            style={{ marginHorizontal: 8 }}
          />
        ))}
      </View>
      
      <View style={styles.endButtonsContainer}>
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          <Text style={styles.buttonText}>
            {isPerfectScore() ? "Play Again" : "Try Again"}
          </Text>
        </TouchableOpacity>
      </View>
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
              <Text style={styles.correctText}>🎉 Correct! +$10</Text>
            ) : (
              <>
                <Text style={styles.incorrectText}>❌ Oops! That was wrong</Text>
                <Text style={styles.correctAnswerText}>
                  The correct answer is{" "}
                  <Text style={styles.correctAnswer}>{currentQuestion.answer}</Text>
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

  
  const renderStarsModal = () => {
    if (!showStars || !isPerfectScore()) return null;
    return (
      <Modal transparent animationType="fade" visible={showStars}>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.starsTitle}>🌟 Lesson Complete! 🌟</Text>
            <Text style={styles.starsSubtitle}>Perfect score! You've unlocked a star!</Text>
            <StarWithOverlay lessonId={level || ""} style={styles.celebrationStar} />
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setShowStars(false)}
            >
              <Text style={styles.buttonText}>Awesome!</Text>
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
      
      {loading && renderLoading()}
      {error && !loading && renderError()}
      {!loading && !error && (
        <>
          {screen === "start" && renderStart()}
          {screen === "quiz" && renderQuiz()}
          {screen === "end" && renderEnd()}
          {renderFeedback()}
          {renderStarsModal()}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#EEEDE9" 
  },
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
    marginBottom: 20,
    textAlign: "center",
  },
  completionRequirement: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9800",
    marginBottom: 8,
    textAlign: "center",
  },
  completionMessage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 12,
    textAlign: "center",
  },
  incompleteMessage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9800",
    marginBottom: 12,
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#8DA94E",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#D23F3F",
    textAlign: "center",
    marginBottom: 24,
  },
  endButtonsContainer: {
    alignItems: "center",
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
    marginBottom: 24,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  questionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    lineHeight: 26,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: "#8DA94E",
    backgroundColor: "#F8FAF6",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D2D2D",
    textAlign: "center",
  },
  selectedOptionText: {
    color: "#8DA94E",
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  popup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    maxWidth: width * 0.9,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  correctText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
    marginBottom: 24,
    textAlign: "center",
  },
  incorrectText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F44336",
    marginBottom: 16,
    textAlign: "center",
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  correctAnswer: {
    fontWeight: "700",
    color: "#4CAF50",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  starContainer: {
    position: "relative",
    width: 40,
    height: 40,
  },
  starImage: {
    width: "100%",
    height: "100%",
  },
  yellowOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 235, 59, 0.6)", 
    borderRadius: 20, 
  },
  celebrationStar: {
    width: 80,
    height: 80,
    marginVertical: 20,
  },
  starsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#027361",
    marginBottom: 8,
    textAlign: "center",
  },
  starsSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3A3A3A",
    marginBottom: 16,
    textAlign: "center",
  },
});

