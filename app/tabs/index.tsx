import LogoHeader from "@/components/LogoHeader";
import UserAvatar from "@/components/UserAvatar";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  { x: 100, y: 60, level: "1" },
  { x: 200, y: 180, level: "2" },
  { x: 120, y: 310, level: "3" },
  { x: 180, y: 440, level: "4" },
  { x: 100, y: 570, level: "5" },
];

const SUBJECT_OPTIONS = [
  { label: "Math", value: "Math" },
  { label: "English", value: "English" },
  { label: "Science", value: "Science" },
  { label: "Social Studies", value: "Social Studies" },
];

const UNIT_OPTIONS = [
  { label: "Unit 1", value: "Unit 1" },
  { label: "Unit 2", value: "Unit 2" },
  { label: "Unit 3", value: "Unit 3" },
  { label: "Unit 4", value: "Unit 4" },
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
};

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const router = useRouter();

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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
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
          data={SUBJECT_OPTIONS}
          labelField="label"
          valueField="value"
          value={selectedSubject}
          onChange={(item) => setSelectedSubject(item.value)}
          placeholder="Choose Subject"
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownText}
        />

        <Text style={styles.label}>Select Unit</Text>
        <Dropdown
          data={UNIT_OPTIONS}
          labelField="label"
          valueField="value"
          value={selectedUnit}
          onChange={(item) => setSelectedUnit(item.value)}
          placeholder="Choose Unit"
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownText}
        />
      </View>

      {selectedSubject && selectedUnit && (
        <View style={styles.utilityRow}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryText}> Spend Coins</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryText}> Open Chat</Text>
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

          return (
            <TouchableOpacity
              key={`star-${index}`}
              onPress={() => canInteract && setActiveLevel(item.level)}
              style={[
                styles.star,
                { left: item.x, top: item.y },
                !canInteract && styles.starDisabled,
              ]}
              activeOpacity={canInteract ? 0.7 : 1}
            >
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
              <View style={styles.starTextContainer}>
                <Text
                  style={[
                    styles.starOverlayText,
                    !canInteract && styles.starTextDisabled,
                  ]}
                >
                  {item.level}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeLevel && selectedSubject && selectedUnit && (
        <View style={styles.levelCard}>
          <Text style={styles.levelInfo}>
            Ready for Level {activeLevel} in {selectedSubject}, {selectedUnit}?
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={navigateToQuiz}
          >
            <Text style={styles.startButtonText}>
              Start Level {activeLevel}
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
  starImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  starImageDisabled: {
    opacity: 0.5,
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