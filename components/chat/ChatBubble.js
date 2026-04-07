import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <View
      style={[
        styles.bubbleRow,
        isUser ? styles.userRow : styles.assistantRow,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            isUser ? styles.userText : styles.assistantText,
          ]}
        >
          {message.text}
        </Text>
        <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userRow: {
    alignItems: "flex-end",
  },
  assistantRow: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  userBubble: {
    backgroundColor: "#D4A0BC",
    borderBottomRightRadius: 6,
    shadowColor: "#D4879E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  assistantBubble: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(200,180,190,0.15)",
    shadowColor: "#B8A0B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    lineHeight: 22,
  },
  userText: {
    color: "#FFFFFF",
  },
  assistantText: {
    color: "#5B4B54",
  },
  timestamp: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: "#9A8A92",
    marginTop: 6,
    alignSelf: "flex-end",
  },
  userTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
});
