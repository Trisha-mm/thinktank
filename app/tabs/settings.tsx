import LogoHeader from "@/components/LogoHeader";
import UserAvatar from "@/components/UserAvatar";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
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
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [dailyGoal, setDailyGoal] = useState("");
  const [savedGoal, setSavedGoal] = useState("30");
  const [profileImage, setProfileImage] = useState<string | null>(null);


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const profilePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const createPulse = () => {
      Animated.sequence([
        Animated.timing(profilePulse, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(profilePulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => createPulse());
    };
    createPulse();
  }, []);

  const handleGoalSave = () => {
    if (dailyGoal.trim()) {
      setSavedGoal(dailyGoal);
    }
    setModalVisible(false);
    setDailyGoal("");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
            
              await signOut(auth);
              
        
              await AsyncStorage.removeItem("userId");
              await AsyncStorage.removeItem("isLoggedIn");
             
              router.replace("/loginOptions");
              
              console.log("User logged out successfully");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleProfilePictureChange = () => {
    setProfileModalVisible(true);
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to change your profile picture!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });



    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setProfileImage(uri);
      }
      
    }
    setProfileModalVisible(false);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to take a photo!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      
      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setProfileImage(uri);
      }      
    }
    setProfileModalVisible(false);
  };

  const removeProfilePicture = () => {
    setProfileImage(null);
    setProfileModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.backgroundGradient} />
      
      <View style={styles.logoWrapper}>
        <LogoHeader />
      </View>


      <Animated.View 
        style={[
          styles.profileCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <View style={styles.profileGradient}>
          <TouchableOpacity 
            onPress={handleProfilePictureChange}
            style={styles.avatarContainer}
            activeOpacity={0.8}
          >
            <Animated.View style={[
              styles.avatarWrapper,
              { transform: [{ scale: profilePulse }] }
            ]}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.customAvatar} />
              ) : (
                <UserAvatar size={90} />
              )}
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>📷</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>Trisha Mittal</Text>
            <View style={styles.statusBadge}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.statusText}>Online</Text>
            </View>
            <Text style={styles.emailText}>dummy@gmail.com</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>127</Text>
                <Text style={styles.statLabel}>Days Active</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>42</Text>
                <Text style={styles.statLabel}>Levels</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1,250</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>
          </View>

        
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalIcon}>🎯</Text>
              <Text style={styles.goalTitle}>Daily Goal</Text>
            </View>
            <TouchableOpacity
              style={styles.goalButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.goalText}>{savedGoal} minutes/day</Text>
              <Text style={styles.editText}>✏️ Tap to edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

   
      <Animated.View 
        style={[
          styles.settingsCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.settingsHeader}>
          <Text style={styles.settingsTitle}>⚙️ Settings</Text>
        </View>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <Text style={styles.settingIcon}>🔔</Text>
          <Text style={styles.settingText}>Notifications</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <Text style={styles.settingIcon}>🔒</Text>
          <Text style={styles.settingText}>Privacy & Security</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <Text style={styles.settingIcon}>❓</Text>
          <Text style={styles.settingText}>Help & Support</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <Text style={styles.settingIcon}>ℹ️</Text>
          <Text style={styles.settingText}>About</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.settingsDivider} />

   
        <TouchableOpacity 
          style={[styles.settingItem, styles.logoutItem]} 
          onPress={handleLogout}
          activeOpacity={0.8}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎯 Set Daily Goal</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              How many minutes do you want to study each day?
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter minutes"
                keyboardType="numeric"
                style={styles.input}
                value={dailyGoal}
                onChangeText={setDailyGoal}
                autoFocus
              />
              <Text style={styles.inputSuffix}>min/day</Text>
            </View>

            <View style={styles.quickGoals}>
              <Text style={styles.quickGoalsLabel}>Quick select:</Text>
              <View style={styles.quickGoalsRow}>
                {['15', '30', '45', '60'].map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.quickGoalButton,
                      dailyGoal === goal && styles.quickGoalButtonActive
                    ]}
                    onPress={() => setDailyGoal(goal)}
                  >
                    <Text style={[
                      styles.quickGoalText,
                      dailyGoal === goal && styles.quickGoalTextActive
                    ]}>
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, styles.saveBtn]} onPress={handleGoalSave}>
                <Text style={styles.modalBtnText}>✓ Save Goal</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={profileModalVisible}
        animationType="fade"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContent}>
            <Text style={styles.profileModalTitle}>📷 Change Profile Picture</Text>
            
            <TouchableOpacity
              style={styles.profileOption}
              onPress={takePhoto}
            >
              <Text style={styles.profileOptionIcon}>📸</Text>
              <Text style={styles.profileOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.profileOption}
              onPress={pickImageFromGallery}
            >
              <Text style={styles.profileOptionIcon}>🖼️</Text>
              <Text style={styles.profileOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            {profileImage && (
              <TouchableOpacity 
                style={[styles.profileOption, styles.removeOption]}
                onPress={removeProfilePicture}
              >
                <Text style={styles.profileOptionIcon}>🗑️</Text>
                <Text style={[styles.profileOptionText, styles.removeOptionText]}>Remove Picture</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.profileCancelBtn}
              onPress={() => setProfileModalVisible(false)}
            >
              <Text style={styles.profileCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: "#6C5CE7",
    opacity: 0.05,
  },
  logoWrapper: {
    marginHorizontal: -20,
    marginTop: 0,
    paddingBottom: 20,
  },


  profileCard: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  profileGradient: {
    backgroundColor: "rgba(205, 227, 144, 0.95)",
    padding: 28,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  customAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: "#6C5CE7",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  editBadgeText: {
    fontSize: 12,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  nameText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#006650",
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00D68F",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: "#006650",
  },
  emailText: {
    fontSize: 16,
    color: "#006650",
    opacity: 0.8,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: "#006650",
  },
  statLabel: {
    fontSize: 12,
    color: "#006650",
    opacity: 0.8,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(0, 102, 80, 0.3)",
    marginHorizontal: 16,
  },

  goalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 20,
    padding: 20,
    width: "100%",
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#006650",
  },
  goalButton: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0, 102, 80, 0.2)",
  },
  goalText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#006650",
  },
  editText: {
    fontSize: 14,
    color: "#006650",
    opacity: 0.8,
    marginTop: 6,
  },

  settingsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  settingsHeader: {
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2D3436",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(45, 52, 54, 0.1)",
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
    color: "#2D3436",
    fontWeight: "600",
  },
  settingArrow: {
    fontSize: 20,
    color: "#74B9FF",
    fontWeight: '300',
  },
  settingsDivider: {
    height: 1,
    backgroundColor: "rgba(45, 52, 54, 0.2)",
    marginVertical: 10,
  },
  logoutItem: {
    borderBottomWidth: 0,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 22,
    marginTop: 10,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#006650",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: "#CDE390",
    borderRadius: 16,
    width: "100%",
    padding: 20,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "#F8F9FF",
    fontWeight: '600',
  },
  inputSuffix: {
    position: 'absolute',
    right: 20,
    top: 22,
    fontSize: 14,
    color: "#666",
    fontWeight: '500',
  },
  quickGoals: {
    marginBottom: 28,
  },
  quickGoalsLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    textAlign: 'center',
  },
  quickGoalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickGoalButton: {
    flex: 1,
    backgroundColor: "#F8F9FF",
    borderWidth: 2,
    borderColor: "#CDE390",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickGoalButtonActive: {
    backgroundColor: "#CDE390",
    borderColor: "#006650",
  },
  quickGoalText: {
    fontSize: 16,
    fontWeight: '600',
    color: "#666",
  },
  quickGoalTextActive: {
    color: "#006650",
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#F1F2F6",
  },
  saveBtn: {
    backgroundColor: "#CDE390",
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#006650",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },

  profileModalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
  },
  profileModalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D3436",
    textAlign: 'center',
    marginBottom: 24,
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#F8F9FF",
  },
  profileOptionIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  profileOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: "#2D3436",
  },
  removeOption: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  removeOptionText: {
    color: "#FF6B6B",
  },
  profileCancelBtn: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F1F2F6",
    alignItems: 'center',
  },
  profileCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: "#666",
  },
});