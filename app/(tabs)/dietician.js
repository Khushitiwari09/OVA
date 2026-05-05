/**
 * Your Dietician — Personalized diet & exercise recommendations
 *
 * Reads the latest blood analysis from AsyncStorage and displays:
 *   - What your body needs (nutrients)
 *   - What to eat (diet recommendations)
 *   - What to avoid
 *   - Gentle movement (exercise suggestions)
 *
 * Falls back to phase-based defaults if no blood data is available.
 */

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { OvaBackground } from "@/components/shared/OvaBackground";
import { useCycleStorage } from "@/hooks/useCycleStorage";
import { getPhase } from "@/utils/cycleCalculations";

/* ── Phase-based fallback recommendations ── */

const PHASE_DEFAULTS = {
  menstrual: {
    nutrients: ["Iron", "Vitamin C", "Magnesium", "Omega-3"],
    diet: [
      "Warm lentil soup with spinach",
      "Dark chocolate (70%+ cocoa)",
      "Beetroot and pomegranate smoothie",
      "Iron-fortified oatmeal with dates",
    ],
    avoid: [
      "Excess caffeine",
      "Very salty processed foods",
      "Alcohol",
      "Cold, raw foods if you notice cramps",
    ],
    exercise: [
      "Gentle yoga — child's pose, cat-cow",
      "15-minute nature walk",
      "Light stretching routine",
      "Deep breathing exercises",
    ],
    wellness:
      "Your body is working hard during menstruation. Focus on warmth, rest, and iron-rich nourishment.",
  },
  follicular: {
    nutrients: ["Protein", "B-vitamins", "Vitamin E", "Zinc"],
    diet: [
      "Eggs with avocado toast",
      "Lean chicken or tofu stir-fry",
      "Fresh fruit salad with nuts",
      "Quinoa bowl with roasted vegetables",
    ],
    avoid: [
      "Excess sugar",
      "Highly processed snacks",
      "Skipping meals",
    ],
    exercise: [
      "Moderate cardio — brisk walking or cycling",
      "Strength training with bodyweight",
      "Dance or active group classes",
      "Try something new — energy is rising!",
    ],
    wellness:
      "Estrogen is building — this is your high-energy window. A great time for new habits and activities.",
  },
  ovulatory: {
    nutrients: ["Fiber", "Antioxidants", "Glutathione", "Vitamin D"],
    diet: [
      "Colorful salad with cruciferous veggies",
      "Salmon or mackerel with turmeric rice",
      "Berry smoothie with flaxseed",
      "Light, fiber-rich whole grain meals",
    ],
    avoid: [
      "Heavy, greasy meals",
      "Excess dairy if bloating occurs",
      "Refined carbohydrates",
    ],
    exercise: [
      "HIIT or interval training",
      "Running or swimming laps",
      "High-energy group workouts",
      "Your endurance peaks — enjoy it!",
    ],
    wellness:
      "Peak energy and confidence. Your body can handle more intensity right now. Stay hydrated!",
  },
  luteal: {
    nutrients: ["Magnesium", "Complex carbs", "Calcium", "B6"],
    diet: [
      "Baked sweet potato with tahini",
      "Oatmeal with banana and walnuts",
      "Dark chocolate in moderation",
      "Warm vegetable curry with brown rice",
    ],
    avoid: [
      "Excess caffeine (worsens PMS)",
      "Refined sugar",
      "Salty snacks (increases bloating)",
      "Alcohol",
    ],
    exercise: [
      "Pilates or gentle mat exercises",
      "Swimming or water walking",
      "Relaxed evening walk",
      "Restorative yoga or stretching",
    ],
    wellness:
      "Progesterone is high — cravings and mood shifts are normal. Honor what your body asks for and rest when needed.",
  },
};

/* ── Section Card Component ── */

function SectionCard({ title, icon, iconColor, items, index, bgTint }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 100).springify()}
      style={[s.sectionCard, bgTint && { backgroundColor: bgTint }]}
    >
      <View style={s.sectionHeader}>
        <View style={[s.sectionIconBubble, { backgroundColor: `${iconColor}18` }]}>
          <MaterialIcons name={icon} size={22} color={iconColor} />
        </View>
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      <View style={s.itemsList}>
        {items.map((item, i) => (
          <View key={i} style={s.itemRow}>
            <View style={[s.itemDot, { backgroundColor: iconColor }]} />
            <Text style={s.itemText}>{item}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

/* ════════════════════════════════════════════════════════════════
   Dietician Screen
   ════════════════════════════════════════════════════════════════ */

export default function Dietician() {
  const router = useRouter();
  const { cycleData } = useCycleStorage();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState("phase"); // "blood" or "phase"

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Current phase
  const currentPhase = useMemo(() => {
    if (!cycleData) return "menstrual";
    try {
      return getPhase(new Date(), cycleData);
    } catch {
      return "menstrual";
    }
  }, [cycleData]);

  // Load latest blood analysis or use phase defaults
  useEffect(() => {
    loadRecommendations();
  }, [currentPhase]);

  async function loadRecommendations() {
    setIsLoading(true);
    try {
      // Check for recent blood analysis
      const cached = await AsyncStorage.getItem("@OVA_latestBloodAnalysis");
      if (cached) {
        const parsed = JSON.parse(cached);
        // Only use if less than 3 days old
        const logDate = new Date(parsed.date);
        const now = new Date();
        const daysDiff = (now - logDate) / (1000 * 60 * 60 * 24);

        if (daysDiff < 3 && parsed.diet && parsed.diet.length > 0) {
          setData({
            nutrients: parsed.nutrients || [],
            diet: parsed.diet || [],
            avoid: parsed.avoid || [],
            exercise: parsed.exercise || [],
            wellness: parsed.wellness || "",
            exerciseNote: parsed.exerciseNote || "",
            insight: parsed.insight || "",
            status: parsed.status || "normal",
          });
          setDataSource("blood");
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to load blood analysis:", e);
    }

    // Fallback to phase-based defaults
    const defaults = PHASE_DEFAULTS[currentPhase] || PHASE_DEFAULTS.menstrual;
    setData(defaults);
    setDataSource("phase");
    setIsLoading(false);
  }

  if (!fontsLoaded) return null;

  return (
    <OvaBackground>
      <ScrollView
        style={s.screen}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backArrow}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#5B4B54" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Your Dietician</Text>
            <Text style={s.headerSubtitle}>
              {dataSource === "blood"
                ? "Based on your latest blood log"
                : `Recommendations for ${currentPhase} phase`}
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color="#C9929B" />
            <Text style={s.loadingText}>
              Preparing your personalized plan...
            </Text>
          </View>
        ) : (
          <>
            {/* Wellness Banner */}
            {data?.wellness && (
              <Animated.View
                entering={FadeInDown.duration(400).springify()}
                style={s.wellnessBanner}
              >
                <MaterialIcons name="spa" size={18} color="#B8A0C4" />
                <Text style={s.wellnessText}>{data.wellness}</Text>
              </Animated.View>
            )}

            {/* Insight (from blood analysis) */}
            {dataSource === "blood" && data?.insight && (
              <Animated.View
                entering={FadeInDown.duration(400).delay(50).springify()}
                style={s.insightCard}
              >
                <MaterialIcons name="auto-awesome" size={16} color="#C9929B" />
                <Text style={s.insightText}>{data.insight}</Text>
              </Animated.View>
            )}

            {/* Nutrient Needs */}
            {data?.nutrients && data.nutrients.length > 0 && (
              <SectionCard
                title="What Your Body Needs"
                icon="local-pharmacy"
                iconColor="#E8889A"
                items={data.nutrients.map(
                  (n) => `${n} — consider including ${n.toLowerCase()}-rich foods`
                )}
                index={0}
                bgTint="rgba(232, 136, 154, 0.06)"
              />
            )}

            {/* Diet Recommendations */}
            {data?.diet && data.diet.length > 0 && (
              <SectionCard
                title="What to Eat"
                icon="restaurant"
                iconColor="#6BA07A"
                items={data.diet}
                index={1}
                bgTint="rgba(107, 160, 122, 0.06)"
              />
            )}

            {/* Foods to Avoid */}
            {data?.avoid && data.avoid.length > 0 && (
              <SectionCard
                title="What to Avoid"
                icon="do-not-disturb-on"
                iconColor="#C4784A"
                items={data.avoid}
                index={2}
                bgTint="rgba(196, 120, 74, 0.06)"
              />
            )}

            {/* Exercise */}
            {data?.exercise && data.exercise.length > 0 && (
              <SectionCard
                title="Gentle Movement"
                icon="self-improvement"
                iconColor="#9B7CC0"
                items={data.exercise}
                index={3}
                bgTint="rgba(155, 124, 192, 0.06)"
              />
            )}

            {/* Log Blood Button */}
            <Pressable
              onPress={() => router.push("/(tabs)/bloodTracker")}
              style={({ pressed }) => [
                s.logBtn,
                pressed && { opacity: 0.85 },
              ]}
            >
              <MaterialIcons name="add-circle-outline" size={20} color="#C9929B" />
              <Text style={s.logBtnText}>
                {dataSource === "blood"
                  ? "Log New Blood Data"
                  : "Log Blood Data for Personalized Plan"}
              </Text>
            </Pressable>

            {/* Disclaimer */}
            <Text style={s.disclaimer}>
              These are general wellness suggestions based on your cycle data.
              They are not medical advice. For persistent concerns, please
              consult a healthcare professional.
            </Text>
          </>
        )}
      </ScrollView>
    </OvaBackground>
  );
}

/* ── Styles ── */
const s = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
    gap: 16,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  backArrow: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: "#5B4B54",
  },
  headerSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#9A8A92",
  },

  /* Loading */
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 16,
  },
  loadingText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#9A8A92",
  },

  /* Wellness Banner */
  wellnessBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(184, 160, 196, 0.08)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(184, 160, 196, 0.12)",
  },
  wellnessText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 21,
    color: "#5B4B54",
  },

  /* Insight Card */
  insightCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(201, 146, 155, 0.06)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(201, 146, 155, 0.12)",
  },
  insightText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 21,
    color: "#5B4B54",
  },

  /* Section Cards */
  sectionCard: {
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(200, 180, 190, 0.1)",
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#4B3D45",
  },
  itemsList: {
    gap: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    opacity: 0.6,
  },
  itemText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "#5B4B54",
  },

  /* Log Button */
  logBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(201, 146, 155, 0.1)",
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(201, 146, 155, 0.2)",
  },
  logBtnText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#C9929B",
  },

  /* Disclaimer */
  disclaimer: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    lineHeight: 17,
    color: "#B8A0B0",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
