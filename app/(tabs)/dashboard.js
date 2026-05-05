import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { CycleCarousel } from "@/components/dashboard/CycleCarousel";
import {
  FlowerSticker,
  HeartSticker,
  DropSticker,
  SparkleSticker,
  MoonSticker,
  ButterflySticker,
} from "@/components/dashboard/CuteStickers";
import { PastelCard } from "@/components/dashboard/pastel-card";
import { OvaBackground } from "@/components/shared/OvaBackground";
import { OvaDivider } from "@/components/shared/OvaDivider";
import { OvaMicrocopy } from "@/components/shared/OvaMicrocopy";
import {
  OvumIcon,
  HeartCurveIcon,
} from "@/components/icons/OvaIcons";
import { getDailyAffirmation } from "@/constants/affirmations";
import { useAuth } from "@/context/AuthContext";
import { useCycleStorage } from "@/hooks/useCycleStorage";
import { getNextPeriodDate, getPhaseInfo } from "@/utils/cycleCalculations";

const FEATURE_CARDS = [
  {
    title: "Cycle Tracker",
    subtitle: "Phase timeline and predictions",
    icon: "calendar-month",
    backgroundColor: "#F5E3EA",
    route: "/(tabs)/cycleTracker",
  },
  {
    title: "Aira AI",
    subtitle: "Your caring wellness helper",
    icon: "auto-awesome",
    backgroundColor: "#ECE3F7",
    route: "/(tabs)/aiChat",
  },
  {
    title: "Mood Tracker",
    subtitle: "Log feelings and track trends",
    icon: "favorite-border",
    backgroundColor: "#F5EBDD",
    route: "/(tabs)/moodTracker",
  },
  {
    title: "Your Blood Tracker",
    subtitle: "Understand your cycle better",
    icon: "water-drop",
    backgroundColor: "#F5E3EA",
    route: "/(tabs)/bloodTracker",
  },
  {
    title: "Your Dietician",
    subtitle: "Personalized diet & exercise",
    icon: "restaurant",
    backgroundColor: "#E3F0E9",
    route: "/(tabs)/dietician",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const { cycleData } = useCycleStorage();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const safeName = profile?.name || "there";
  const affirmation = getDailyAffirmation();

  // Cycle computations
  const cycleInfo = useMemo(() => {
    if (!cycleData) return null;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const nextPeriod = getNextPeriodDate(cycleData);
    const phaseInfo = getPhaseInfo(now, cycleData);

    const lpd = new Date(cycleData.lastPeriodDate);
    lpd.setHours(0, 0, 0, 0);
    const cycleDay = Math.max(
      1,
      Math.floor((now.getTime() - lpd.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );

    const daysUntil = Math.max(
      0,
      Math.ceil(
        (nextPeriod.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    return {
      cycleDay,
      nextPeriod: nextPeriod.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }),
      daysUntil,
      phase: phaseInfo,
      cycleLength: cycleData.cycleLength,
    };
  }, [cycleData]);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  if (!fontsLoaded) return null;

  return (
    <OvaBackground>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Floating decorative stickers ── */}
        <View style={styles.stickerLayer} pointerEvents="none">
          <View style={{ position: "absolute", right: 12, top: 110 }}>
            <FlowerSticker size={30} color="#E8889A" opacity={0.10} />
          </View>
          <View style={{ position: "absolute", left: 8, top: 280 }}>
            <HeartSticker size={22} color="#D4A0BC" opacity={0.08} />
          </View>
          <View style={{ position: "absolute", right: 30, top: 520 }}>
            <ButterflySticker size={28} color="#B8A0C4" opacity={0.07} />
          </View>
          <View style={{ position: "absolute", left: 20, top: 680 }}>
            <SparkleSticker size={18} color="#C9929B" opacity={0.09} />
          </View>
          <View style={{ position: "absolute", right: 10, top: 800 }}>
            <MoonSticker size={24} color="#D4A89C" opacity={0.08} />
          </View>
          <View style={{ position: "absolute", left: 40, top: 950 }}>
            <DropSticker size={20} color="#E8889A" opacity={0.07} />
          </View>
          <View style={{ position: "absolute", right: 50, top: 1100 }}>
            <FlowerSticker size={24} color="#B8A0C4" opacity={0.06} />
          </View>
        </View>

        {/* Top bar with logout */}
        <View style={styles.topBar}>
          <View style={styles.brandMark}>
            <OvumIcon size={20} color="#C9929B" />
            <Text style={styles.brandText}>OVA</Text>
          </View>
          <Pressable
            onPress={signOut}
            style={({ pressed }) => [
              styles.logoutBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <MaterialIcons name="logout" size={18} color="#9A8A92" />
          </Pressable>
        </View>

        <View style={styles.topSection}>
          <Text style={styles.greetingOverline}>{greeting}</Text>
          <Text style={styles.greeting}>
            Hi {safeName}, take care of yourself today
          </Text>

          {/* ✨ Stacked cycle cards — tap or drag to peel */}
          <View style={styles.carouselHint}>
            <MaterialIcons name="touch-app" size={14} color="#B8A0B0" />
            <Text style={styles.carouselHintText}>Tap to peel through</Text>
          </View>
          <CycleCarousel cycleInfo={cycleInfo} />
        </View>

        {/* Daily Affirmation */}
        <View style={styles.affirmationCard}>
          <View style={styles.affirmationIcon}>
            <HeartCurveIcon size={20} color="#D4A0BC" />
          </View>
          <View style={styles.affirmationContent}>
            <Text style={styles.affirmationLabel}>Daily Affirmation</Text>
            <Text style={styles.affirmationText}>{affirmation}</Text>
          </View>
        </View>

        {/* Microcopy */}
        <OvaMicrocopy />

        <OvaDivider variant="wave" />

        {/* Insight cards */}
        <View style={styles.middleSection}>
          <Text style={styles.sectionTitle}>For You Today</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalTrack}
          >
            <PastelCard
              title="Health Insight"
              subtitle={
                cycleInfo?.daysUntil <= 3
                  ? `Your cycle may start in ${cycleInfo.daysUntil} days. Stay prepared.`
                  : "Stay hydrated and nourish your body."
              }
              icon="favorite-border"
              backgroundColor="#F4E6EC"
              variant="insight"
              onPress={() => {}}
            />
            <PastelCard
              title="Phase Insight"
              subtitle={
                cycleInfo?.phase
                  ? `${cycleInfo.phase.body.energy}`
                  : "Track your cycle to unlock insights"
              }
              icon="wb-twilight"
              backgroundColor="#EFE6F8"
              variant="insight"
              onPress={() => {}}
            />
            <PastelCard
              title="Daily Tip"
              subtitle="Gentle stretching in the evening helps reduce cramps."
              icon="lightbulb-outline"
              backgroundColor="#F5EBDD"
              variant="insight"
              onPress={() => {}}
            />
          </ScrollView>
        </View>

        <OvaDivider variant="dots" />

        {/* Feature Cards */}
        <View style={styles.bottomSection}>
          <Text style={styles.sectionTitle}>Quick Features</Text>
          <View style={styles.grid}>
            {FEATURE_CARDS.map((item) => (
              <PastelCard
                key={item.title}
                title={item.title}
                subtitle={item.subtitle}
                icon={item.icon}
                backgroundColor={item.backgroundColor}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route);
                  }
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </OvaBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 20,
  },

  // Floating sticker layer
  stickerLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  brandMark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#5B4B54",
    letterSpacing: 1.5,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  topSection: {
    gap: 12,
    zIndex: 1,
  },
  greetingOverline: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#9A8A92",
    letterSpacing: 0.2,
  },
  greeting: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    lineHeight: 34,
    color: "#5B4B54",
  },

  // Carousel hint
  carouselHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    marginBottom: -4,
  },
  carouselHintText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#B8A0B0",
    letterSpacing: 0.2,
  },

  // Affirmation
  affirmationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(212,160,188,0.15)",
    zIndex: 1,
  },
  affirmationIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(212,160,188,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  affirmationContent: { flex: 1, gap: 4 },
  affirmationLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#D4A0BC",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  affirmationText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "#5B4B54",
  },

  middleSection: {
    gap: 14,
    zIndex: 1,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#5D4D56",
  },
  horizontalTrack: {
    paddingVertical: 2,
    paddingRight: 4,
  },
  bottomSection: {
    gap: 14,
    zIndex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
