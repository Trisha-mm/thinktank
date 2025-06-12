import LogoHeader from "@/components/LogoHeader";
import UserAvatar from "@/components/UserAvatar";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyGoal, setDailyGoal] = useState("");
  const [savedGoal, setSavedGoal] = useState("30");

  const handleGoalSave = () => {
    if (dailyGoal.trim()) {
      setSavedGoal(dailyGoal);
    }
    setModalVisible(false);
    setDailyGoal("");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.logoWrapper}>
        <LogoHeader />
      </View>

      {/* Profile Section */}
      <View style={styles.profileCard}>
        <UserAvatar size={80} />
        <Text style={styles.nameText}>Trisha Mittal</Text>
        <Text style={styles.emailText}>dummy@gmail.com</Text>

        {/* Daily Goal Inside Profile Card */}
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}> Daily Goal</Text>
          <TouchableOpacity
            style={styles.goalButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.goalText}>{savedGoal} minutes/day</Text>
            <Text style={styles.editText}>Tap to edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Menu */}
      <View style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, styles.lastItem]}>
          <Text style={styles.settingText}>About</Text>
        </TouchableOpacity>
      </View>

      {/* Goal Setting Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Daily Goal</Text>
            <Text style={styles.modalSubtitle}>
              How many minutes do you want to study each day?
            </Text>

            <TextInput
              placeholder="Enter minutes"
              keyboardType="numeric"
              style={styles.input}
              value={dailyGoal}
              onChangeText={setDailyGoal}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalBtn} onPress={handleGoalSave}>
                <Text style={styles.modalBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  logoWrapper: {
    marginHorizontal: -30,
    marginTop: 0,
    paddingBottom: 20,
  },
  profileCard: {
    backgroundColor: "#CDE390",
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006650",
    marginTop: 16,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: "#006650",
    opacity: 0.8,
    marginBottom: 20,
  },

  goalCard: {
    backgroundColor: "#CDE390",
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006650",
    marginBottom: 12,
    textAlign: "center",
  },
  goalButton: {
    backgroundColor: "rgba(0, 102, 80, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  goalText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#006650",
  },
  editText: {
    fontSize: 12,
    color: "#006650",
    opacity: 0.7,
    marginTop: 4,
  },
  settingsCard: {
    backgroundColor: "#CDE390",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#006650",

  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#006650",
    fontWeight: "500",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#006650",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "#CDE390",
    borderRadius: 12,
    width: "100%",
    padding: 16,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    backgroundColor: "#F5F5F5",
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    backgroundColor: "#CDE390",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#E0E0E0",
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#006650",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
});
