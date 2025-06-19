import { db } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Timestamp,
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    updateDoc
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UserAvatar = ({ size = 40 }) => (
    <View style={[styles.avatar, { width: size, height: size }]}> 
        <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>👤</Text>
    </View>
);

type Message = {
    id: string;
    userId: string;
    message: string;
    timestamp: Timestamp;
    readStatus: boolean;
};

export default function ChatScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const selectedUserName = params.selectedUserName as string;
    const selectedUserId = params.selectedUserId as string;

    const createChatId = (id1: string, id2: string) => [id1, id2].sort().join('');

    const getCurrentUserId = async () => {
        try {
            const id = await AsyncStorage.getItem("userId");
            setCurrentUserId(id);
            return id;
        } catch (e) {
            console.error("AsyncStorage error", e);
            return null;
        }
    };

    const fetchMessages = (chatId: string) => {
        const ref = doc(db, "chats", chatId);
        const unsubscribe = onSnapshot(ref, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const messagesArray = data.messages || [];
                const mapped = messagesArray.map((msg: any, i: number) => ({
                    id: i.toString(),
                    ...msg,
                }));
                setMessages(mapped);
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            }
        });
        return unsubscribe;
    };

    const sendMessage = async () => {
        if (!input.trim() || !currentUserId || !selectedUserId) return;
      
        const chatId = createChatId(currentUserId, selectedUserId);
        const ref = doc(db, "chats", chatId);
      
        setLoading(true);
        try {
          const docSnap = await getDoc(ref);
      
          const message = {
            message: input.trim(),
            userId: currentUserId,
            timestamp: Timestamp.fromDate(new Date()), 
            readStatus: false,
          };
      
          if (docSnap.exists()) {
            await updateDoc(ref, {
              messages: arrayUnion(message),
            });
          } else {
            await setDoc(ref, {
              messages: [message],
            });
          }
      
          setInput("");
        } catch (e) {
          console.error("Send error", e);
          Alert.alert("Error", "Message failed.");
        } finally {
          setLoading(false);
        }
      };
      

    const formatTime = (timestamp: Timestamp) => {
        if (!timestamp) return "";
        return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.userId === currentUserId;
        return (
            <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.otherBubble]}>
                {!isUser && <View style={styles.avatarContainer}><UserAvatar size={32} /></View>}
                <View style={[styles.messageContent, isUser ? styles.userMessageContent : styles.otherMessageContent]}>
                    <Text style={[styles.messageText, isUser ? styles.userText : styles.otherText]}>{item.message}</Text>
                    <Text style={[styles.timeText, isUser ? styles.userTimeText : styles.otherTimeText]}>{formatTime(item.timestamp)}</Text>
                </View>
            </View>
        );
    };

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', e => setKeyboardHeight(e.endCoordinates.height));
        const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
        return () => { show.remove(); hide.remove(); };
    }, []);

    useEffect(() => { getCurrentUserId(); }, []);

    useEffect(() => {
        if (currentUserId && selectedUserId) {
            const chatId = createChatId(currentUserId, selectedUserId);
            return fetchMessages(chatId);
        }
    }, [currentUserId, selectedUserId]);

    if (!selectedUserName || !selectedUserId) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Invalid chat parameters</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backText}>← Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>

                <View style={styles.chatHeader}>
                    <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
                    <View style={styles.headerUserInfo}><UserAvatar size={36} /><Text style={styles.chatUserName}>{selectedUserName}</Text></View>
                    <View style={styles.headerSpacer} />
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    style={styles.messagesList}
                    contentContainerStyle={[styles.messagesContainer, { paddingBottom: Math.max(20, keyboardHeight * 0.1) }]}
                    showsVerticalScrollIndicator={false}
                />

                <View style={[styles.inputContainer, Platform.OS === 'android' && keyboardHeight > 0 && { marginBottom: keyboardHeight * 0.05 }]}> 
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        value={input}
                        onChangeText={setInput}
                        multiline
                        maxLength={500}
                        returnKeyType="send"
                        onSubmitEditing={() => !loading && input.trim() && sendMessage()}
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
                        onPress={sendMessage}
                        disabled={!input.trim() || loading}>
                        <Text style={[styles.sendText, (!input.trim() || loading) && styles.sendTextDisabled]}>
                            {loading ? "..." : "Send"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    keyboardContainer: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: "#666",
        marginBottom: 20,
        textAlign: "center",
    },
    backButton: {
        padding: 10,
    },
    backText: {
        fontSize: 16,
        color: "#006650",
        fontWeight: "600",
    },
    chatHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        justifyContent: "space-between",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerUserInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    headerSpacer: {
        width: 60,
    },
    chatUserName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#006650",
        marginLeft: 10,
    },
    messagesList: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    messagesContainer: {
        padding: 16,
        flexGrow: 1,
    },
    messageBubble: {
        flexDirection: "row",
        marginBottom: 12,
        maxWidth: "85%",
    },
    userBubble: {
        alignSelf: "flex-end",
        justifyContent: "flex-end",
    },
    otherBubble: {
        alignSelf: "flex-start",
        justifyContent: "flex-start",
    },
    avatarContainer: {
        marginRight: 8,
        alignSelf: "flex-end",
    },
    avatar: {
        borderRadius: 20,
        backgroundColor: "#E0E0E0",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#666",
    },
    messageContent: {
        padding: 12,
        borderRadius: 16,
        minWidth: 80,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    userMessageContent: {
        backgroundColor: "#CDE390",
    },
    otherMessageContent: {
        backgroundColor: "#FFFFFF",
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    userText: {
        color: "#004d3d",
    },
    otherText: {
        color: "#333",
    },
    timeText: {
        fontSize: 12,
        marginTop: 4,
    },
    userTimeText: {
        color: "#004d3d",
        opacity: 0.7,
        textAlign: "right",
    },
    otherTimeText: {
        color: "#666",
        textAlign: "left",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        padding: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#F8F8F8",
        borderRadius: 20,
        color: "#000",
        fontSize: 16,
        textAlignVertical: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    sendButton: {
        marginLeft: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#006650",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        minWidth: 60,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    sendButtonDisabled: {
        backgroundColor: "#ccc",
        elevation: 0,
        shadowOpacity: 0,
    },
    sendText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    sendTextDisabled: {
        color: "#999",
    },
});