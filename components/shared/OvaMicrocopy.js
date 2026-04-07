/**
 * OvaMicrocopy — Warm, supportive rotating messages
 *
 * Displays emotionally intelligent microcopy that rotates
 * based on time of day and day of week.
 */

import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PetalIcon } from "@/components/icons/OvaIcons";

const MESSAGES = [
  "Take it slow today",
  "Your body is finding its rhythm",
  "You're doing enough",
  "Listen to what you need right now",
  "Gentle with yourself, always",
  "You are exactly where you need to be",
  "Your pace is the right pace",
  "Softness is strength",
  "Honor what your body tells you",
  "This moment is yours",
  "Rest is productive too",
  "You carry grace within you",
  "Be kind to your body today",
  "Your rhythm is uniquely beautiful",
];

export function OvaMicrocopy({ style }) {
  const message = useMemo(() => {
    const now = new Date();
    const dayOfYear = Math.floor(
      (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const hour = now.getHours();
    const idx = (dayOfYear * 3 + Math.floor(hour / 6)) % MESSAGES.length;
    return MESSAGES[idx];
  }, []);

  return (
    <View style={[styles.container, style]}>
      <PetalIcon size={16} color="#C9929B" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  text: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    fontStyle: "italic",
    color: "#9A8A92",
    letterSpacing: 0.3,
  },
});
