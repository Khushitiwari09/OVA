/**
 * CuteStickers — Adorable period-themed SVG decorative elements
 *
 * Tiny, low-opacity stickers to scatter across slide backgrounds
 * for a playful, warm, and emotionally engaging aesthetic.
 */

import React from "react";
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

const DEFAULT_SIZE = 32;

/* ─── Flower Bloom ─── five petals around a center ─── */
export function FlowerSticker({ size = DEFAULT_SIZE, color = "#E8889A", opacity = 0.18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" opacity={opacity}>
      <G>
        {/* Petals */}
        <Ellipse cx="16" cy="9" rx="4" ry="6" fill={color} opacity={0.5} />
        <Ellipse cx="16" cy="9" rx="4" ry="6" fill={color} opacity={0.5}
          transform="rotate(72 16 16)" />
        <Ellipse cx="16" cy="9" rx="4" ry="6" fill={color} opacity={0.5}
          transform="rotate(144 16 16)" />
        <Ellipse cx="16" cy="9" rx="4" ry="6" fill={color} opacity={0.5}
          transform="rotate(216 16 16)" />
        <Ellipse cx="16" cy="9" rx="4" ry="6" fill={color} opacity={0.5}
          transform="rotate(288 16 16)" />
        {/* Center */}
        <Circle cx="16" cy="16" r="3.5" fill="#F5D0A9" opacity={0.7} />
      </G>
    </Svg>
  );
}

/* ─── Heart Sticker ─── cute puffy heart ─── */
export function HeartSticker({ size = DEFAULT_SIZE, color = "#D4A0BC", opacity = 0.2 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" opacity={opacity}>
      <Path
        d="M16 28C16 28 4 20 4 12C4 8 7 5 10.5 5C13 5 15 6.5 16 8.5C17 6.5 19 5 21.5 5C25 5 28 8 28 12C28 20 16 28 16 28Z"
        fill={color}
      />
    </Svg>
  );
}

/* ─── Water Drop ─── period/hydration drop ─── */
export function DropSticker({ size = DEFAULT_SIZE, color = "#C9929B", opacity = 0.15 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" opacity={opacity}>
      <Path
        d="M16 4C16 4 8 14 8 20C8 24.4 11.6 28 16 28C20.4 28 24 24.4 24 20C24 14 16 4 16 4Z"
        fill={color}
      />
      <Ellipse cx="13" cy="18" rx="2.5" ry="3" fill="white" opacity={0.3} />
    </Svg>
  );
}

/* ─── Sparkle Star ─── four-pointed star ─── */
export function SparkleSticker({ size = DEFAULT_SIZE, color = "#B8A0C4", opacity = 0.2 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" opacity={opacity}>
      <Path
        d="M16 2L18.5 13.5L30 16L18.5 18.5L16 30L13.5 18.5L2 16L13.5 13.5L16 2Z"
        fill={color}
      />
    </Svg>
  );
}

/* ─── Crescent Moon ─── cozy nighttime vibes ─── */
export function MoonSticker({ size = DEFAULT_SIZE, color = "#D4A89C", opacity = 0.18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" opacity={opacity}>
      <Path
        d="M22 6C18 6 14.5 9 13 13C11.5 17 12.5 21.5 15 25C11 24.5 7 21 6 16C4.5 9 9 3 16 2C19 2 21 3.5 22 6Z"
        fill={color}
      />
      {/* Tiny star */}
      <Circle cx="24" cy="8" r="1.5" fill={color} opacity={0.6} />
    </Svg>
  );
}

/* ─── Cloud Sticker ─── soft and dreamy ─── */
export function CloudSticker({ size = DEFAULT_SIZE, color = "#DACBE9", opacity = 0.2 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" opacity={opacity}>
      <Path
        d="M8 22C5.2 22 3 19.8 3 17C3 14.5 4.8 12.5 7.2 12.1C7.6 9.2 10 7 13 7C15.2 7 17.1 8.2 18.2 10C18.8 9.7 19.4 9.5 20 9.5C22.5 9.5 24.5 11.5 24.5 14C24.5 14.2 24.5 14.3 24.4 14.5C26.4 15 28 16.8 28 19C28 21.8 25.8 22 23 22H8Z"
        fill={color}
      />
    </Svg>
  );
}

/* ─── Butterfly ─── transformation / cycles ─── */
export function ButterflySticker({ size = DEFAULT_SIZE, color = "#C9929B", opacity = 0.15 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" opacity={opacity}>
      <G>
        {/* Left wing */}
        <Ellipse cx="11" cy="13" rx="7" ry="5" fill={color} opacity={0.6}
          transform="rotate(-20 11 13)" />
        <Ellipse cx="10" cy="20" rx="5" ry="4" fill={color} opacity={0.4}
          transform="rotate(10 10 20)" />
        {/* Right wing */}
        <Ellipse cx="21" cy="13" rx="7" ry="5" fill={color} opacity={0.6}
          transform="rotate(20 21 13)" />
        <Ellipse cx="22" cy="20" rx="5" ry="4" fill={color} opacity={0.4}
          transform="rotate(-10 22 20)" />
        {/* Body */}
        <Rect x="15" y="8" width="2" height="16" rx="1" fill={color} opacity={0.7} />
      </G>
    </Svg>
  );
}
