import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function PastelCard({
  title,
  subtitle,
  icon,
  backgroundColor,
  onPress,
  variant = "grid",
}) {
  const isInsight = variant === "insight";

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "rgba(95, 80, 90, 0.08)", borderless: false }}
      style={({ pressed }) => [
        styles.base,
        isInsight ? styles.insightCard : styles.gridCard,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconBubble}>
        <MaterialIcons name={icon} size={20} color="#6D5A66" />
      </View>

      <View style={styles.contentWrap}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={2} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 24,
    padding: 18,
    shadowColor: "#6C5873",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 5,
    overflow: "hidden",
  },
  insightCard: {
    width: 240,
    minHeight: 128,
    marginRight: 16,
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    minHeight: 164,
    marginBottom: 16,
    justifyContent: "space-between",
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  contentWrap: {
    gap: 6,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#5B4B54",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#7A6A73",
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
});
