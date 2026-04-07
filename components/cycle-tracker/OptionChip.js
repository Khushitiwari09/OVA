import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export function OptionChip({ label, selected, onPress, color = "#E8B4CB" }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && { backgroundColor: color, borderColor: color },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 1.5,
    borderColor: "rgba(200, 180, 190, 0.3)",
    marginRight: 10,
    marginBottom: 10,
    shadowColor: "#B8A0B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  label: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#6D5C65",
  },
  labelSelected: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
  },
});
