/**
 * OvaBackground — Premium decorative background wrapper
 *
 * Renders subtle SVG curves, circles, and organic shapes
 * behind screen content. All decorative elements are at 4–8% opacity
 * to create a soft, safe, feminine atmosphere.
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export function OvaBackground({ children, variant = "default" }) {
  return (
    <View style={styles.container}>
      {/* Base gradient */}
      <LinearGradient
        colors={
          variant === "auth"
            ? ["#FDF5F7", "#F8EEF5", "#F3EAF0", "#F5F1EB"]
            : ["#FAF7F8", "#F8F4F2", "#FAF7F4"]
        }
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative SVG layer */}
      <View style={styles.svgLayer} pointerEvents="none">
        <Svg width={SCREEN_W} height={SCREEN_H} style={StyleSheet.absoluteFillObject}>
          {/* ── Flowing S-curve on left edge (cycle rhythm) ── */}
          <Path
            d={`M -20 ${SCREEN_H * 0.15}
                C ${SCREEN_W * 0.15} ${SCREEN_H * 0.2},
                  ${SCREEN_W * 0.05} ${SCREEN_H * 0.35},
                  -10 ${SCREEN_H * 0.45}
                S ${SCREEN_W * 0.1} ${SCREEN_H * 0.6},
                  -20 ${SCREEN_H * 0.7}`}
            stroke="rgba(201, 146, 155, 0.06)"
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />

          {/* ── Second flowing curve on right (mirrored rhythm) ── */}
          <Path
            d={`M ${SCREEN_W + 20} ${SCREEN_H * 0.55}
                C ${SCREEN_W * 0.85} ${SCREEN_H * 0.6},
                  ${SCREEN_W * 0.95} ${SCREEN_H * 0.72},
                  ${SCREEN_W + 10} ${SCREEN_H * 0.82}`}
            stroke="rgba(184, 160, 196, 0.05)"
            strokeWidth={1.2}
            fill="none"
            strokeLinecap="round"
          />

          {/* ── Concentric circles upper-right (ovum symbolism) ── */}
          <G opacity={0.05}>
            <Circle
              cx={SCREEN_W * 0.82}
              cy={SCREEN_H * 0.12}
              r={60}
              stroke="#C9929B"
              strokeWidth={1}
              fill="none"
            />
            <Circle
              cx={SCREEN_W * 0.82}
              cy={SCREEN_H * 0.12}
              r={40}
              stroke="#C9929B"
              strokeWidth={0.8}
              fill="none"
            />
            <Circle
              cx={SCREEN_W * 0.82}
              cy={SCREEN_H * 0.12}
              r={6}
              fill="#C9929B"
              opacity={0.3}
            />
          </G>

          {/* ── Small ovum circles scattered ── */}
          <Circle
            cx={SCREEN_W * 0.15}
            cy={SCREEN_H * 0.85}
            r={20}
            stroke="rgba(184, 160, 196, 0.04)"
            strokeWidth={1}
            fill="none"
          />
          <Circle
            cx={SCREEN_W * 0.15}
            cy={SCREEN_H * 0.85}
            r={3}
            fill="rgba(184, 160, 196, 0.06)"
          />

          {/* ── Botanical accent — delicate petal curve, bottom-left ── */}
          <Path
            d={`M ${SCREEN_W * 0.05} ${SCREEN_H * 0.92}
                Q ${SCREEN_W * 0.12} ${SCREEN_H * 0.88},
                  ${SCREEN_W * 0.2} ${SCREEN_H * 0.93}
                Q ${SCREEN_W * 0.12} ${SCREEN_H * 0.96},
                  ${SCREEN_W * 0.05} ${SCREEN_H * 0.92} Z`}
            stroke="rgba(201, 170, 140, 0.05)"
            strokeWidth={0.8}
            fill="rgba(201, 170, 140, 0.02)"
          />

          {/* ── Tiny cycle dots ── */}
          {[0.25, 0.32, 0.38, 0.43, 0.47].map((x, i) => (
            <Circle
              key={i}
              cx={SCREEN_W * x}
              cy={SCREEN_H * 0.08}
              r={1.5 + Math.abs(2 - i) * 0.3}
              fill="rgba(201, 146, 155, 0.07)"
            />
          ))}

          {/* ── Gentle arc across middle ── */}
          <Path
            d={`M ${SCREEN_W * 0.6} ${SCREEN_H * 0.4}
                Q ${SCREEN_W * 0.75} ${SCREEN_H * 0.35},
                  ${SCREEN_W * 0.9} ${SCREEN_H * 0.42}`}
            stroke="rgba(201, 146, 155, 0.04)"
            strokeWidth={1}
            fill="none"
            strokeLinecap="round"
          />

          {/* ── Ellipse accent for auth variant ── */}
          {variant === "auth" && (
            <Ellipse
              cx={SCREEN_W * 0.5}
              cy={SCREEN_H * 0.3}
              rx={SCREEN_W * 0.35}
              ry={80}
              stroke="rgba(212, 160, 188, 0.04)"
              strokeWidth={1}
              fill="none"
            />
          )}
        </Svg>
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  svgLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
});
