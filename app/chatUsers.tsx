import UserAvatar from "@/components/UserAvatar";
import { db } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type User = {
    id: string;
    name: string;
    email: string;
    levelsCompleted: number;
    rank: number;
    medal?: any;
};

export default function ChatUsers() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
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

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            const currentId = await getCurrentUserId();
            
            const usersSnapshot = await getDocs(collection(db, "users"));
            const users: User[] = [];

            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();
                const userId = userDoc.id;
       
                if (userId === currentId) {
                    continue;
                }

                users.push({
                    id: userId,
                    name: userData.displayName || userData.email?.split("@")[0] || "Anonymous",
                    email: userData.email || "",
                    levelsCompleted: userData.levelsCompleted || 0,
                    rank: 0,
                });
            }
            setUsers(users);
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateChatId = (userId1: string, userId2: string) => {
      
        return [userId1, userId2].sort().join("");
    };

    const handleUserPress = async (selectedUser: User) => {
        if (!currentUserId) {
            console.error("Current user ID not found");
            return;
        }

        try {
            const chatId = generateChatId(currentUserId, selectedUser.id);
            const chatDocRef = doc(db, "chats", chatId);
            
     
            const chatDoc = await getDoc(chatDocRef);
            
            if (!chatDoc.exists()) {
        
                await setDoc(chatDocRef, {
                    participants: [currentUserId, selectedUser.id],
                    createdAt: new Date(),
                });
            }


            router.push({
                pathname: "/chat",
                params: {
                    chatId,
                    selectedUserId: selectedUser.id,
                    selectedUserName: selectedUser.name,
                    selectedUserEmail: selectedUser.email,
                }
            });
        } catch (error) {
            console.error("Error handling user press:", error);
        }
    };

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const renderUserItem = ({ item }: { item: User }) => (
        <Pressable 
            style={styles.userItem} 
            onPress={() => handleUserPress(item)}
        >
            <UserAvatar />
            <Text style={styles.userName}>{item.name}</Text>
        </Pressable>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#006650" />
                    <Text style={styles.loadingText}>Loading users...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                
                <Text style={styles.title}>Chat!</Text>
                
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={renderUserItem}
                    contentContainerStyle={styles.userList}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 16,
    },
    backButton: {
        marginBottom: 20,
        marginTop: 10,
    },
    backText: {
        fontSize: 16,
        color: "#006650",
        fontWeight: "bold",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#006650",
        textAlign: "center",
        marginBottom: 24,
    },
    userList: {
        paddingBottom: 20,
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E9F4DC",
        padding: 18,
        borderRadius: 16,
        marginBottom: 14,
    },
    userName: {
        marginLeft: 14,
        fontSize: 18,
        color: "#006650",
        fontWeight: "600",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#006650",
    },
});