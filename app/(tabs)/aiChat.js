import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ChatBubble } from "@/components/chat/ChatBubble";
import { FeminineIcon } from "@/components/icons/OvaIcons";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useAuth } from "@/context/AuthContext";
import { useAI } from "@/hooks/useAI";
import { useCycleStorage } from "@/hooks/useCycleStorage";

export default function AIChatScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { cycleData } = useCycleStorage();
  const { messages, isLoading, sendMessage, clearChat } = useAI(
    cycleData,
    profile
  );

  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [inputText, sendMessage]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#FDF5F7", "#F8EEF5", "#F3EAF0", "#F0E8EC"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <MaterialIcons name="arrow-back-ios" size={18} color="#7A6170" />
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={styles.airaBubble}>
            <FeminineIcon size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Aira (OVA AI)</Text>
            <Text style={styles.headerSubtitle}>Your wellness companion</Text>
          </View>
        </View>

        <Pressable
          onPress={clearChat}
          style={({ pressed }) => [
            styles.clearBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <MaterialIcons name="refresh" size={20} color="#9A8A92" />
        </Pressable>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <MaterialIcons name="info-outline" size={13} color="#9A8A92" />
        <Text style={styles.disclaimerText}>
          General wellness guidance only — not medical advice
        </Text>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatArea}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask Aira anything..."
              placeholderTextColor="#B8A0B0"
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <Pressable
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
              style={({ pressed }) => [
                styles.sendBtn,
                (!inputText.trim() || isLoading) && styles.sendBtnDisabled,
                pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
              ]}
            >
              <MaterialIcons
                name="send"
                size={20}
                color={inputText.trim() && !isLoading ? "#FFFFFF" : "#C8B8C0"}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 6,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  airaBubble: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#C9929B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4879E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
    color: "#4B3D45",
  },
  headerSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#9A8A92",
  },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Disclaimer
  disclaimer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    marginHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 14,
    marginBottom: 8,
  },
  disclaimerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#9A8A92",
  },

  // Chat
  chatArea: { flex: 1 },
  messageList: {
    paddingTop: 8,
    paddingBottom: 12,
  },

  // Input
  inputBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    backgroundColor: "rgba(253,245,247,0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(200,180,190,0.12)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: "rgba(200,180,190,0.2)",
  },
  input: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#4B3D45",
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D4A0BC",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4879E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  sendBtnDisabled: {
    backgroundColor: "rgba(200,180,190,0.3)",
    shadowOpacity: 0,
    elevation: 0,
  },
});
