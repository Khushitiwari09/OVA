/**
 * OvaButton — Premium tactile button system for OVA
 *
 * Variants: primary, secondary, ghost, soft
 * Smooth spring-based press animation via Reanimated.
 */

import React from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const SPRING_CONFIG = { damping: 15, stiffness: 150, mass: 0.8 };

const VARIANTS = {
  primary: {
    gradient: ["#D4A0BC", "#C9929B"],
    textColor: "#FFFFFF",
    borderColor: "transparent",
    borderWidth: 0,
    shadowColor: "#D4879E",
    shadowOpacity: 0.25,
  },
  secondary: {
    gradient: null,
    backgroundColor: "rgba(184, 160, 196, 0.12)",
    textColor: "#5B4B54",
    borderColor: "rgba(184, 160, 196, 0.25)",
    borderWidth: 1.5,
    shadowColor: "#B8A0B0",
    shadowOpacity: 0.1,
  },
  ghost: {
    gradient: null,
    backgroundColor: "transparent",
    textColor: "#C9929B",
    borderColor: "transparent",
    borderWidth: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
  },
  soft: {
    gradient: null,
    backgroundColor: "#F5F1EB",
    textColor: "#5B4B54",
    borderColor: "rgba(200, 180, 190, 0.2)",
    borderWidth: 1.5,
    shadowColor: "#B8A0B0",
    shadowOpacity: 0.08,
  },
};

export function OvaButton({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled = false,
  style,
}) {
  const scale = useSharedValue(1);
  const v = VARIANTS[variant] || VARIANTS.primary;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, SPRING_CONFIG);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

  const inner = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={v.textColor}
        />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              sizeStyle.text,
              { color: v.textColor },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (v.gradient) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <LinearGradient
          colors={disabled ? ["#D4C8CE", "#C8BCC2"] : v.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            sizeStyle.container,
            {
              shadowColor: v.shadowColor,
              shadowOpacity: v.shadowOpacity,
            },
            disabled && styles.disabled,
          ]}
        >
          <Animated.View
            style={styles.innerRow}
            onTouchStart={disabled ? undefined : handlePressIn}
            onTouchEnd={disabled ? undefined : () => { handlePressOut(); onPress?.(); }}
            onTouchCancel={disabled ? undefined : handlePressOut}
          >
            {inner}
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.base,
        sizeStyle.container,
        {
          backgroundColor: v.backgroundColor,
          borderColor: v.borderColor,
          borderWidth: v.borderWidth,
          shadowColor: v.shadowColor,
          shadowOpacity: v.shadowOpacity,
        },
        disabled && styles.disabled,
        style,
      ]}
      onTouchStart={disabled ? undefined : handlePressIn}
      onTouchEnd={disabled ? undefined : () => { handlePressOut(); onPress?.(); }}
      onTouchCancel={disabled ? undefined : handlePressOut}
    >
      <Animated.View style={styles.innerRow}>
        {inner}
      </Animated.View>
    </Animated.View>
  );
}

const SIZE_STYLES = {
  sm: {
    container: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 18 },
    text: { fontSize: 13 },
  },
  md: {
    container: { paddingVertical: 16, paddingHorizontal: 28, borderRadius: 24 },
    text: { fontSize: 15 },
  },
  lg: {
    container: { paddingVertical: 18, paddingHorizontal: 36, borderRadius: 28 },
    text: { fontSize: 17 },
  },
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
    overflow: "hidden",
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  text: {
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.6,
  },
});
