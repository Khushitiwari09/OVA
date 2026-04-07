/**
 * OvaDivider — Organic section divider with subtle curved line
 * and optional dot or petal accent.
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export function OvaDivider({ variant = "wave", color = "rgba(201, 146, 155, 0.12)" }) {
  if (variant === "dots") {
    return (
      <View style={styles.container}>
        <View style={styles.dotRow}>
          {[0.35, 0.6, 1, 0.6, 0.35].map((opacity, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  opacity,
                  backgroundColor: "#C9929B",
                  width: 4 + Math.abs(2 - i) * 1.2,
                  height: 4 + Math.abs(2 - i) * 1.2,
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Svg width="100%" height={16} viewBox="0 0 320 16" preserveAspectRatio="none">
        <Path
          d="M0 8 C40 2, 80 14, 120 8 S200 2, 240 8 S300 14, 320 8"
          stroke={color}
          strokeWidth={1}
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx="160" cy="8" r="2.5" fill={color} opacity={0.6} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    alignItems: "center",
  },
  dotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    borderRadius: 999,
  },
});
