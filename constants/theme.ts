/**
 * OVA Design Token System
 * Premium feminine health app — soft, warm, emotionally intelligent palette.
 */

import { Platform } from 'react-native';

/* ── OVA Brand Colors ─────────────────────────────────────────────── */

export const OvaColors = {
  // Primary
  dustyPink:       '#C9929B',
  dustyPinkLight:  '#E8CFD5',
  dustyPinkSoft:   '#F5E3EA',
  dustyPinkMuted:  'rgba(201, 146, 155, 0.12)',

  // Secondary
  mutedLavender:    '#B8A0C4',
  lavenderLight:    '#DACBE9',
  lavenderSoft:     '#ECE3F7',
  lavenderMuted:    'rgba(184, 160, 196, 0.10)',

  // Warm accents
  warmPeach:        '#EEDBCB',
  softApricot:      '#F5EBDD',
  accentRose:       '#D4A0BC',

  // Neutrals — plum scale
  deepPlum:         '#4B3D45',
  softPlum:         '#5B4B54',
  mutedPlum:        '#6D5C65',
  lightPlum:        '#7A6A73',
  palePlum:         '#9A8A92',
  whisperPlum:      '#B8A0B0',
  blushPlum:        '#C4B8BE',

  // Backgrounds
  warmBeige:        '#F5F1EB',
  creamWhite:       '#FAF7F4',
  screenBg:         '#FAF7F8',
  cardBg:           'rgba(255, 255, 255, 0.65)',
  cardBgSolid:      '#FFFFFF',

  // Borders
  borderLight:      'rgba(200, 180, 190, 0.15)',
  borderMedium:     'rgba(200, 180, 190, 0.25)',
  borderAccent:     'rgba(212, 160, 188, 0.30)',

  // Decorative — extremely low opacity for background SVG elements
  decoLine:         'rgba(201, 146, 155, 0.06)',
  decoCircle:       'rgba(184, 160, 196, 0.05)',
  decoLeaf:         'rgba(201, 170, 140, 0.04)',
  decoDot:          'rgba(201, 146, 155, 0.08)',

  // Feedback
  errorRose:        '#C45A6E',
  successSage:      '#7BA68C',

  // Shadows
  shadowPrimary:    '#8C748A',
  shadowSecondary:  '#B8A0B0',
  shadowRose:       '#D4879E',
};

/* ── Legacy Colors (kept for backward compat) ──────────────────── */

const tintColorLight = '#D4A0BC';
const tintColorDark = '#E8CFD5';

export const Colors = {
  light: {
    text: OvaColors.deepPlum,
    background: OvaColors.screenBg,
    tint: tintColorLight,
    icon: OvaColors.palePlum,
    tabIconDefault: OvaColors.whisperPlum,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/* ── Fonts ──────────────────────────────────────────────────────── */

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/* ── Spacing / Radius Tokens ────────────────────────────────────── */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 28,
  pill: 999,
};
