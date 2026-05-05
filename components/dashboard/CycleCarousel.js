/**
 * CycleCarousel — Dashboard cycle info as stacked peelable cards
 *
 * Uses the StackedCards engine for a premium sheet-peeling interaction.
 * Each card shows different cycle-related content with cute stickers.
 */

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  FlowerSticker,
  HeartSticker,
  DropSticker,
  SparkleSticker,
  MoonSticker,
  CloudSticker,
  ButterflySticker,
} from "./CuteStickers";
import { StackedCards } from "./StackedCards";
import {
  CycleLoopIcon,
  HeartCurveIcon,
  PetalIcon,
  OvumIcon,
} from "@/components/icons/OvaIcons";

/* ─────────────── Slide Data Builder ─────────────── */

function buildSlides(cycleInfo) {
  return [
    {
      key: "overview",
      title: `Day ${cycleInfo?.cycleDay || 1}`,
      subtitle: "of your cycle",
      gradient: ["#E8CFDB", "#DACBE9", "#EEDBCB"],
      icon: <CycleLoopIcon size={22} color="#705F68" />,
      label: "Cycle Overview",
      body:
        (cycleInfo?.phase?.description?.substring(0, 90) + "...") ||
        "Track your cycle to see insights",
      stats: [
        { label: "Cycle Length", value: `${cycleInfo?.cycleLength || 28} Days` },
        { label: "Next Period", value: cycleInfo?.nextPeriod || "—" },
      ],
      badge: cycleInfo?.phase
        ? { text: cycleInfo.phase.name.replace(" Phase", ""), color: cycleInfo.phase.color }
        : null,
      stickers: [
        { Comp: FlowerSticker, x: "82%", y: "5%", size: 38, color: "#E8889A" },
        { Comp: DropSticker, x: "4%", y: "72%", size: 28, color: "#C9929B" },
        { Comp: SparkleSticker, x: "88%", y: "68%", size: 22, color: "#D4A0BC" },
      ],
    },
    {
      key: "body",
      title: "Body Signals",
      subtitle: "how you might feel today",
      gradient: ["#DACBE9", "#E8CFDB", "#ECE3F7"],
      icon: <OvumIcon size={22} color="#9B7CC0" />,
      label: "Body & Energy",
      bodyItems: [
        {
          icon: "bolt",
          label: "Energy",
          value: cycleInfo?.phase?.body?.energy || "Track your cycle for insights",
          color: "#D4A89C",
        },
        {
          icon: "mood",
          label: "Mood",
          value: cycleInfo?.phase?.body?.mood || "Log periods to unlock",
          color: "#9B7CC0",
        },
        {
          icon: "face-retouching-natural",
          label: "Skin",
          value: cycleInfo?.phase?.body?.skin || "Insights appear after tracking",
          color: "#E8889A",
        },
      ],
      stickers: [
        { Comp: ButterflySticker, x: "80%", y: "2%", size: 36, color: "#B8A0C4" },
        { Comp: HeartSticker, x: "5%", y: "68%", size: 24, color: "#E8889A" },
        { Comp: CloudSticker, x: "75%", y: "72%", size: 30, color: "#DACBE9" },
      ],
    },
    {
      key: "tips",
      title: "Self-Care Tips",
      subtitle: "gentle advice for today",
      gradient: ["#EEDBCB", "#E8CFDB", "#F5EBDD"],
      icon: <PetalIcon size={22} color="#D4A89C" />,
      label: "Wellness Tips",
      tips: cycleInfo?.phase?.tips || [
        "Stay hydrated throughout the day",
        "Listen to your body's signals",
        "Gentle movement helps your mood",
        "Give yourself grace today",
      ],
      stickers: [
        { Comp: MoonSticker, x: "82%", y: "4%", size: 34, color: "#D4A89C" },
        { Comp: FlowerSticker, x: "3%", y: "76%", size: 26, color: "#C9929B" },
        { Comp: SparkleSticker, x: "72%", y: "78%", size: 20, color: "#B8A0C4" },
      ],
    },
    {
      key: "countdown",
      title:
        cycleInfo?.daysUntil != null ? `${cycleInfo.daysUntil} Days` : "— Days",
      subtitle: "until next period",
      gradient: ["#F5E3EA", "#DACBE9", "#E8CFDB"],
      icon: <HeartCurveIcon size={22} color="#E8889A" />,
      label: "Period Countdown",
      countdown: {
        days: cycleInfo?.daysUntil ?? 0,
        nextDate: cycleInfo?.nextPeriod || "—",
        phase: cycleInfo?.phase?.name || "Unknown",
        progress: cycleInfo
          ? Math.min(1, cycleInfo.cycleDay / (cycleInfo.cycleLength || 28))
          : 0,
      },
      stickers: [
        { Comp: DropSticker, x: "84%", y: "6%", size: 30, color: "#E8889A" },
        { Comp: HeartSticker, x: "6%", y: "74%", size: 26, color: "#D4A0BC" },
        { Comp: ButterflySticker, x: "78%", y: "70%", size: 28, color: "#C9929B" },
      ],
    },
  ];
}

/* ─────────────── Card Content Renderer ─────────────── */

function CycleSlideCard({ slide }) {
  return (
    <LinearGradient
      colors={slide.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.card}
    >
      {/* Sticker decorations */}
      {slide.stickers?.map((st, i) => (
        <View
          key={i}
          style={[s.stickerWrap, { left: st.x, top: st.y }]}
          pointerEvents="none"
        >
          <st.Comp size={st.size} color={st.color} opacity={0.18} />
        </View>
      ))}

      {/* Header */}
      <View style={s.headerRow}>
        <View style={s.labelRow}>
          {slide.icon}
          <Text style={s.labelText}>{slide.label}</Text>
        </View>
        {slide.badge && (
          <View style={[s.badge, { backgroundColor: slide.badge.color }]}>
            <Text style={s.badgeText}>{slide.badge.text}</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={s.title}>{slide.title}</Text>
      <Text style={s.subtitle}>{slide.subtitle}</Text>

      {/* Overview body */}
      {slide.body && <Text style={s.bodyText}>{slide.body}</Text>}

      {/* Stats pills */}
      {slide.stats && (
        <View style={s.statsRow}>
          {slide.stats.map((st, i) => (
            <View key={i} style={s.statPill}>
              <Text style={s.statLabel}>{st.label}</Text>
              <Text style={s.statValue}>{st.value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Body items */}
      {slide.bodyItems && (
        <View style={s.bodyItemsCol}>
          {slide.bodyItems.map((item, i) => (
            <View key={i} style={s.bodyItemRow}>
              <View style={[s.bodyItemDot, { backgroundColor: item.color }]} />
              <View style={s.bodyItemContent}>
                <Text style={s.bodyItemLabel}>{item.label}</Text>
                <Text style={s.bodyItemValue} numberOfLines={2}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Tips */}
      {slide.tips && (
        <View style={s.tipsCol}>
          {slide.tips.map((tip, i) => (
            <View key={i} style={s.tipRow}>
              <View style={s.tipBullet}>
                <MaterialIcons name="spa" size={12} color="#C9929B" />
              </View>
              <Text style={s.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Countdown */}
      {slide.countdown && (
        <View style={s.countdownWrap}>
          <View style={s.progressTrack}>
            <View
              style={[
                s.progressFill,
                { width: `${Math.max(5, slide.countdown.progress * 100)}%` },
              ]}
            />
            <View
              style={[
                s.progressDot,
                { left: `${Math.max(3, slide.countdown.progress * 100)}%` },
              ]}
            />
          </View>
          <View style={s.countdownStats}>
            <View style={s.statPill}>
              <Text style={s.statLabel}>Next Period</Text>
              <Text style={s.statValue}>{slide.countdown.nextDate}</Text>
            </View>
            <View style={s.statPill}>
              <Text style={s.statLabel}>Current Phase</Text>
              <Text style={s.statValue}>
                {slide.countdown.phase.replace(" Phase", "")}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Peel hint */}
      <View style={s.peelHint}>
        <MaterialIcons name="touch-app" size={12} color="#B8A0B0" />
        <Text style={s.peelHintText}>Tap or drag to peel</Text>
      </View>
    </LinearGradient>
  );
}

/* ─────────────── Exported Wrapper ─────────────── */

export function CycleCarousel({ cycleInfo }) {
  const slides = useMemo(() => buildSlides(cycleInfo), [cycleInfo]);

  const renderCard = (item) => <CycleSlideCard slide={item} />;

  return <StackedCards data={slides} renderCard={renderCard} />;
}

/* ─────────────── Styles ─────────────── */

const s = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 22,
    gap: 8,
    minHeight: 280,
    overflow: "hidden",
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 30,
    elevation: 10,
  },
  stickerWrap: {
    position: "absolute",
    zIndex: 0,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#705F68",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
    color: "#FFFFFF",
  },

  /* Title */
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    lineHeight: 36,
    color: "#4B3D45",
    zIndex: 1,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#7A6973",
    marginTop: -4,
    zIndex: 1,
  },

  /* Body text */
  bodyText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#6D5C65",
    marginTop: 4,
    zIndex: 1,
  },

  /* Stats */
  statsRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 12,
    zIndex: 1,
  },
  statPill: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.42)",
  },
  statLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#7A6973",
    marginBottom: 2,
  },
  statValue: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#564751",
  },

  /* Body items */
  bodyItemsCol: {
    gap: 8,
    marginTop: 6,
    zIndex: 1,
  },
  bodyItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bodyItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  bodyItemContent: {
    flex: 1,
    gap: 1,
  },
  bodyItemLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#5B4B54",
  },
  bodyItemValue: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#6D5C65",
  },

  /* Tips */
  tipsCol: {
    gap: 8,
    marginTop: 6,
    zIndex: 1,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(201, 146, 155, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "#5B4B54",
  },

  /* Countdown */
  countdownWrap: {
    gap: 14,
    marginTop: 10,
    zIndex: 1,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    overflow: "visible",
    position: "relative",
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C9929B",
    opacity: 0.6,
  },
  progressDot: {
    position: "absolute",
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#C9929B",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#C9929B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  countdownStats: {
    flexDirection: "row",
    gap: 12,
  },

  /* Peel hint */
  peelHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "center",
    marginTop: 6,
    zIndex: 1,
  },
  peelHintText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: "#B8A0B0",
    letterSpacing: 0.3,
  },
});
