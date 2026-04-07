import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PastelCard } from "@/components/dashboard/pastel-card";
import { OvaBackground } from "@/components/shared/OvaBackground";
import { OvaDivider } from "@/components/shared/OvaDivider";
import { OvaMicrocopy } from "@/components/shared/OvaMicrocopy";
import {
  OvumIcon,
  HeartCurveIcon,
  CycleLoopIcon,
  PetalIcon,
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
    title: "Body Signals",
    subtitle: "Symptoms, flow, and notes",
    icon: "self-improvement",
    backgroundColor: "#E9EEF3",
    route: "/(tabs)/cycleTracker",
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

          {/* Cycle summary card */}
          <LinearGradient
            colors={["#E8CFDB", "#DACBE9", "#EEDBCB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredCard}
          >
            <View style={styles.featuredHeaderRow}>
              <View style={styles.featuredLabelRow}>
                <CycleLoopIcon size={16} color="#705F68" />
                <Text style={styles.featuredLabel}>Cycle Summary</Text>
              </View>
              {cycleInfo?.phase && (
                <View
                  style={[
                    styles.phaseBadge,
                    { backgroundColor: cycleInfo.phase.color },
                  ]}
                >
                  <Text style={styles.phaseBadgeText}>
                    {cycleInfo.phase.name.replace(" Phase", "")}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.featuredTitle}>
              Day {cycleInfo?.cycleDay || 1} • Cycle Tracking
            </Text>
            <Text style={styles.featuredSubtitle}>
              {cycleInfo?.phase?.description?.substring(0, 80)}...
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.statLabel}>Cycle Length</Text>
                <Text style={styles.statValue}>
                  {cycleInfo?.cycleLength || 28} Days
                </Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statLabel}>Next Period</Text>
                <Text style={styles.statValue}>
                  {cycleInfo?.nextPeriod || "—"}
                </Text>
              </View>
            </View>
          </LinearGradient>
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    gap: 16,
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
  featuredCard: {
    borderRadius: 28,
    padding: 24,
    gap: 10,
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 9,
  },
  featuredHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featuredLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#705F68",
  },
  phaseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  phaseBadgeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  featuredTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 22,
    lineHeight: 30,
    color: "#4B3D45",
  },
  featuredSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "#6D5C65",
  },
  statsRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 12,
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
    fontSize: 12,
    color: "#7A6973",
    marginBottom: 2,
  },
  statValue: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#564751",
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
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
