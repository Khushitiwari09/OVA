/**
 * OVA Custom Icon System
 *
 * Thin-line SVG icons inspired by the OVA logo motifs:
 * ovum circles, cycle loops, petals, flowing curves, heart accents.
 */

import React from "react";
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";

const DEFAULT_COLOR = "#C9929B";
const DEFAULT_SIZE = 24;

/* ─── Ovum Icon ─── small circle with highlight dot ─── */
export function OvumIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx="9.5" cy="9.5" r="2" fill={color} opacity={0.25} />
      <Circle cx="9" cy="9" r="0.8" fill={color} opacity={0.5} />
    </Svg>
  );
}

/* ─── Cycle Loop Icon ─── infinity-like loop ─── */
export function CycleLoopIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M16 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.5}
      />
    </Svg>
  );
}

/* ─── Petal Icon ─── soft leaf / petal ─── */
export function PetalIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3C8 8 6 12 6 15c0 4 2.7 6 6 6s6-2 6-6c0-3-2-7-6-12z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 21V10"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.3}
      />
    </Svg>
  );
}

/* ─── Heart Curve Icon ─── heart with flowing curves (logo-inspired) ─── */
export function HeartCurveIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 7.5C12 5 10.5 3 8 3S4 5 4 7.5C4 14 12 19 12 19s8-5 8-11.5C20 5 18.5 3 16 3s-4 2-4 4.5z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ─── Rhythm Dots Icon ─── graduated dots for phase indicators ─── */
export function RhythmDotsIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }) {
  const dotCount = 5;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {Array.from({ length: dotCount }).map((_, i) => {
        const cx = 4 + i * 4;
        const r = 1 + (i < 3 ? i * 0.4 : (4 - i) * 0.4);
        const opacity = 0.3 + (i < 3 ? i * 0.2 : (4 - i) * 0.2);
        return (
          <Circle
            key={i}
            cx={cx}
            cy="12"
            r={r}
            fill={color}
            opacity={opacity}
          />
        );
      })}
    </Svg>
  );
}

/* ─── Wave Icon ─── gentle sine wave for dividers ─── */
export function WaveIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }) {
  return (
    <Svg width={size} height={size / 3} viewBox="0 0 48 16" fill="none">
      <Path
        d="M0 8 C6 2, 12 2, 16 8 S26 14, 32 8 S42 2, 48 8"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

/* ─── Feminine Silhouette Icon ─── abstract (logo-like) ─── */
export function FeminineIcon({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G opacity={0.9}>
        {/* Left loop */}
        <Ellipse
          cx="8.5"
          cy="8"
          rx="4"
          ry="5"
          stroke={color}
          strokeWidth={1.4}
          transform="rotate(-15 8.5 8)"
        />
        {/* Right loop */}
        <Ellipse
          cx="15.5"
          cy="8"
          rx="4"
          ry="5"
          stroke={color}
          strokeWidth={1.4}
          transform="rotate(15 15.5 8)"
        />
        {/* Heart at top */}
        <Path
          d="M11 6.5C11 5.5 11.5 5 12 5s1 .5 1 1.5"
          stroke={color}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        {/* Flowing curves down */}
        <Path
          d="M10 12 C10.5 16, 11 19, 12 21"
          stroke={color}
          strokeWidth={1.3}
          strokeLinecap="round"
        />
        <Path
          d="M14 12 C13.5 16, 13 19, 12 21"
          stroke={color}
          strokeWidth={1.3}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}
