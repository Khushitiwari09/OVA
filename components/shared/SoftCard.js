import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Reusable soft card with the app's premium pastel aesthetic.
 */
export function SoftCard({
  children,
  style,
  onPress,
  backgroundColor = "rgba(255,255,255,0.65)",
}) {
  const content = (
    <View style={[styles.card, { backgroundColor }, style]}>{children}</View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: 22,
    shadowColor: "#B8A0B0",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
