import LogoHeader from "@/components/LogoHeader";
import UserAvatar from "@/components/UserAvatar";
import { db } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";

type User = {
  id: string;
  name: string;
  email: string;
  levelsCompleted: number;
  rank: number;
  medal?: any;
};

export default function Progress() {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const getCurrentUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      setCurrentUserId(userId);
      return userId;
    } catch (error) {
      console.error("Error getting user ID from AsyncStorage:", error);
      return null;
    }
  };

  const countUserCompletedLevels = async (userId: string): Promise<number> => {
    try {
      let levelsCompleted = 0;
      
      const subjectsSnapshot = await getDocs(collection(db, "subjects"));
      
      for (const subjectDoc of subjectsSnapshot.docs) {
        const subjectId = subjectDoc.id;
        
        try {
          const lessonsSnapshot = await getDocs(
            collection(db, "subjects", subjectId, "lessons")
          );
          
      
          for (const lessonDoc of lessonsSnapshot.docs) {
            const lessonId = lessonDoc.id;
            
            try {
            
              const userLessonRef = doc(db, "users", userId, "subjects", subjectId, "lessons", lessonId);
              const userLessonDoc = await getDoc(userLessonRef);
              
              if (userLessonDoc.exists() && userLessonDoc.data().finished === true) {
                levelsCompleted++;
              }
            } catch (lessonError) {
             
              console.log(`User ${userId} hasn't completed lesson ${lessonId} in subject ${subjectId}`);
            }
          }
        } catch (subjectError) {
          console.error(`Error checking subject ${subjectId} for user ${userId}:`, subjectError);
        }
      }
      
      return levelsCompleted;
    } catch (error) {
      console.error(`Error counting levels for user ${userId}:`, error);
      return 0;
    }
  };

 
  const updateUserLevelsCompleted = async (userId: string, count: number) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        levelsCompleted: count,
      });
    } catch (error) {
      console.error("Error updating user levels completed:", error);
    }
  };

 
  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      

      const usersSnapshot = await getDocs(collection(db, "users"));
      const users: User[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;
      
        const actualLevelsCompleted = await countUserCompletedLevels(userId);
        
       
        await updateUserLevelsCompleted(userId, actualLevelsCompleted);

        users.push({
          id: userId,
          name: userData.displayName || userData.email?.split("@")[0] || "Anonymous",
          email: userData.email || "",
          levelsCompleted: actualLevelsCompleted,
          rank: 0, 
        });
      }

      
      users.sort((a, b) => b.levelsCompleted - a.levelsCompleted);

 
      const rankedUsers = users.map((user, index) => {
        const rank = index + 1;
        let medal = undefined;
        
        if (rank === 1) {
          medal = require("@/assets/images/gold.png");
        } else if (rank === 2) {
          medal = require("@/assets/images/silver.png");
        } else if (rank === 3) {
          medal = require("@/assets/images/bronze.png");
        }

        return {
          ...user,
          rank,
          medal,
        };
      });

      setLeaderboard(rankedUsers);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await getCurrentUserId();
      await fetchLeaderboardData();
    };
    
    initializeData();
  }, []);

 
  const refreshLeaderboard = async () => {
    await fetchLeaderboardData();
  };

  const renderLeaderboardItem = ({ item }: { item: User }) => (
    <View 
      style={[
        styles.row, 
        item.rank === 1 ? styles.highlightRow : null,
        item.id === currentUserId ? styles.currentUserRow : null
      ]}
    >
      <UserAvatar />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.name}</Text>
        <Text style={styles.levelsText}>
          {item.levelsCompleted} level{item.levelsCompleted !== 1 ? 's' : ''} completed
        </Text>
      </View>
      <View style={styles.rankSection}>
        <Text style={styles.rank}>{item.rank}</Text>
        {item.medal && <Image source={item.medal} style={styles.medal} />}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <LogoHeader />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006650" />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <LogoHeader />
      </View>

      <Text style={styles.title}>Leaderboard</Text>
      
      {leaderboard.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.id}
          renderItem={renderLeaderboardItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#006650",
    textAlign: "center",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  highlightRow: {
    backgroundColor: "#CDE390",
  },
  currentUserRow: {
    borderWidth: 2,
    borderColor: "#006650",
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 18,
    color: "#006650",
    fontWeight: "600",
  },
  levelsText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  rankSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  rank: {
    fontSize: 18,
    color: "#006650",
    marginRight: 5,
    fontWeight: "bold",
  },
  medal: {
    width: 24,
    height: 24,
  },
  logoWrapper: {
    marginHorizontal: -30,
    marginTop: -20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
});