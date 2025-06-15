import LogoHeader from "@/components/LogoHeader";
import UserAvatar from "@/components/UserAvatar";
import { db } from "@/firebaseConfig"; // Adjust import path as needed
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Svg, { Line } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const STAR_POSITIONS = [
  { x: 100, y: 60, level: "lesson1" },
  { x: 200, y: 180, level: "lesson2" },
  { x: 120, y: 310, level: "lesson3" },
  { x: 180, y: 440, level: "lesson4" },
  { x: 100, y: 570, level: "lesson5" },
];

const colors = {
  background: "#EEEDE9",
  white: "#FFFFFF",
  primary: "#8DA94E",
  primaryLight: "#B3D49B",
  secondary: "#bad381",
  text: "#3A3A3A",
  textLight: "#666",
  textMuted: "#444",
  border: "#C4C4C4",
  cardBackground: "#F5F5F5",
  inputBackground: "#F9F9F9",
  progressBackground: "#DADADA",
  yellowOverlay: "rgba(255, 235, 59, 0.6)", // Light yellow overlay color
};

type Subject = {
  label: string;
  value: string;
};

type Lesson = {
  id: string;
  finished: boolean;
  // Add other lesson properties as needed
};

// Star Component with conditional overlay
const StarWithOverlay = ({ 
  lessonId, 
  isCompleted, 
  isActive, 
  canInteract, 
  onPress, 
  style, 
  index 
}: {
  lessonId: string;
  isCompleted: boolean;
  isActive: boolean;
  canInteract: boolean;
  onPress: () => void;
  style: any;
  index: number;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.star,
        style,
        !canInteract && styles.starDisabled,
      ]}
      activeOpacity={canInteract ? 0.7 : 1}
    >
      <View style={styles.starContainer}>
        <Image
          source={require("@/assets/images/star.png")}
          style={[
            styles.starImage,
            isActive && {
              tintColor: colors.secondary,
              transform: [{ scale: 1.05 }],
              shadowColor: colors.secondary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.6,
              shadowRadius: 4,
            },
            !canInteract && styles.starImageDisabled,
          ]}
        />
        {/* Light yellow overlay when completed */}
        {isCompleted && (
          <View style={styles.yellowOverlay} />
        )}
      </View>
      
      <View style={styles.starTextContainer}>
        <Text
          style={[
            styles.starOverlayText,
            !canInteract && styles.starTextDisabled,
          ]}
        >
          {index + 1}
        </Text>
      </View>
      
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const router = useRouter();

  // Fetch subjects from Firestore
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsSnapshot = await getDocs(collection(db, "subjects"));
        const subjectsList: Subject[] = [];
        
        subjectsSnapshot.forEach((doc) => {
          const subjectName = doc.id;
          subjectsList.push({
            label: subjectName.charAt(0).toUpperCase() + subjectName.slice(1),
            value: subjectName,
          });
        });
        
        setSubjects(subjectsList);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Fetch lessons when subject is selected
  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedSubject) {
        setLessons([]);
        return;
      }

      setLessonsLoading(true);
      try {
        const lessonsSnapshot = await getDocs(
          collection(db, "subjects", selectedSubject, "lessons")
        );
        
        const lessonsList: Lesson[] = [];
        lessonsSnapshot.forEach((doc) => {
          const data = doc.data();
          lessonsList.push({
            id: doc.id,
            finished: data.finished || false,
          });
        });
        
        setLessons(lessonsList);
        // Auto-select the first unit/lesson if available
        if (lessonsList.length > 0) {
          setSelectedUnit(lessonsList[0].id);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLessonsLoading(false);
      }
    };

    fetchLessons();
  }, [selectedSubject]);

  // Refresh lessons when returning from quiz (to update completed status)
  const handleFocus = () => {
    if (selectedSubject) {
      // Refetch lessons to get updated completion status
      const fetchUpdatedLessons = async () => {
        try {
          const lessonsSnapshot = await getDocs(
            collection(db, "subjects", selectedSubject, "lessons")
          );
          
          const lessonsList: Lesson[] = [];
          lessonsSnapshot.forEach((doc) => {
            const data = doc.data();
            lessonsList.push({
              id: doc.id,
              finished: data.finished || false,
            });
          });
          
          setLessons(lessonsList);
        } catch (error) {
          console.error("Error fetching updated lessons:", error);
        }
      };

      fetchUpdatedLessons();
    }
  };

  // Listen for focus events (when user returns to this screen)
  useEffect(() => {
    // You might want to add a focus listener here if using React Navigation
    // For now, we'll just refresh when selectedSubject changes
  }, []);

  const navigateToQuiz = () => {
    if (selectedSubject && selectedUnit && activeLevel) {
      router.push({
        pathname: "/tabs/games",
        params: {
          subject: selectedSubject,
          unit: selectedUnit,
          level: activeLevel
        }
      });
    }
  };

  const getLessonStatus = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson?.finished || false;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading subjects...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      onLayout={handleFocus} // Refresh data when screen becomes visible
    >
      <View style={styles.logoWrapper}>
        <LogoHeader />
      </View>

      <View style={styles.welcomeCard}>
        <View style={styles.welcomeRow}>
          <UserAvatar />
          <Text style={styles.title}>Welcome Back!</Text>
        </View>
      </View>

      <Text style={styles.label}>Daily Progress</Text>
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Select Subject</Text>
        <Dropdown
          data={subjects}
          labelField="label"
          valueField="value"
          value={selectedSubject}
          onChange={(item) => {
            setSelectedSubject(item.value);
            setSelectedUnit(null);
            setActiveLevel(null);
          }}
          placeholder="Choose Subject"
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownText}
        />
        
        {lessonsLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading lessons...</Text>
          </View>
        )}
      </View>

      {selectedSubject && selectedUnit && (
        <View style={styles.utilityRow}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>💰 Spend Coins</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>💬 Open Chat</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.mapContainer}>
        <Svg style={StyleSheet.absoluteFill}>
          {STAR_POSITIONS.map((pos, index) => {
            const next = STAR_POSITIONS[index + 1];
            if (!next) return null;
            return (
              <Line
                key={`line-${index}`}
                x1={pos.x + 40}
                y1={pos.y + 40}
                x2={next.x + 40}
                y2={next.y + 40}
                stroke={colors.primaryLight}
                strokeWidth={4}
              />
            );
          })}
        </Svg>

        {STAR_POSITIONS.map((item, index) => {
          const isActive = activeLevel === item.level;
          const canInteract = selectedSubject && selectedUnit;
          const isCompleted = getLessonStatus(item.level);

          return (
            <StarWithOverlay
              key={`star-${index}`}
              lessonId={item.level}
              isCompleted={isCompleted}
              isActive={isActive}
              canInteract={!!canInteract}
              onPress={() => canInteract && setActiveLevel(item.level)}
              style={{ left: item.x, top: item.y }}
              index={index}
            />
          );
        })}
      </View>

      {activeLevel && selectedSubject && selectedUnit && (
        <View style={styles.levelCard}>
          <Text style={styles.levelInfo}>
            Ready for Lesson {STAR_POSITIONS.findIndex(p => p.level === activeLevel) + 1} in {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)}?
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={navigateToQuiz}
          >
            <Text style={styles.startButtonText}>
              Start Lesson {STAR_POSITIONS.findIndex(p => p.level === activeLevel) + 1}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 60,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    marginHorizontal: -50,
    marginVertical: -20,
    paddingBottom: 30,
  },
  welcomeCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textLight,
    marginTop: 12,
    marginBottom: 6,
  },
  progressBar: {
    height: 14,
    backgroundColor: colors.progressBackground,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: colors.primaryLight,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    elevation: 3,
  },
  dropdown: {
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginVertical: 6,
  },
  dropdownPlaceholder: {
    color: colors.textLight,
    fontSize: 14,
  },
  dropdownText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textLight,
  },
  utilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
  },
  secondaryText: {
    fontWeight: "600",
    color: colors.textMuted,
    fontSize: 14,
  },
  mapContainer: {
    position: "relative",
    height: 700,
    marginTop: 0,
  },
  star: {
    position: "absolute",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  starDisabled: {
    opacity: 0.6,
  },
  starContainer: {
    position: "relative",
    width: 80,
    height: 80,
  },
  starImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  starImageDisabled: {
    opacity: 0.5,
  },
  yellowOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.yellowOverlay,
    borderRadius: 40, // Rounded to match star shape better
  },
  starTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
  },
  starOverlayText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 22,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  starTextDisabled: {
    opacity: 0.7,
  },
  completedBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  completedBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  levelCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
    alignItems: "center",
    elevation: 5,
  },
  levelInfo: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    elevation: 4,
  },
  startButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});