/**
 * Blood Tracker — Guided multi-step period blood logging screen
 *
 * Steps:
 *   1. Color selection (Bright Red, Dark Red, Brown, Pink)
 *   2. Flow selection (Light, Medium, Heavy)
 *   3. Clots toggle (Yes / No)
 *   → Submit → Analyze → Show insight
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
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";

import { OvaBackground } from "@/components/shared/OvaBackground";
import { useAuth } from "@/context/AuthContext";
import { analyzeBlood } from "@/lib/bloodAnalysisApi";
import { useCycleStorage } from "@/hooks/useCycleStorage";
import { getPhase } from "@/utils/cycleCalculations";

const BLOOD_LOG_KEY = "@OVA_bloodLogs";

/* ── Option Data ───────────────────────────────────────── */

const COLOR_OPTIONS = [
  {
    id: "bright_red",
    label: "Bright Red",
    color: "#E85454",
    description: "Fresh, vibrant red",
  },
  {
    id: "dark_red",
    label: "Dark Red",
    color: "#8B2020",
    description: "Deep, rich red",
  },
  {
    id: "brown",
    label: "Brown",
    color: "#7A4B2E",
    description: "Dark brown or rust",
  },
  {
    id: "pink",
    label: "Pink",
    color: "#E8889A",
    description: "Light pinkish tint",
  },
];

const FLOW_OPTIONS = [
  {
    id: "light",
    label: "Light",
    icon: "water-drop",
    description: "Spotting or light",
  },
  {
    id: "medium",
    label: "Medium",
    icon: "opacity",
    description: "Steady, normal flow",
  },
  {
    id: "heavy",
    label: "Heavy",
    icon: "waves",
    description: "Soaking through quickly",
  },
];

const CLOT_OPTIONS = [
  { id: true, label: "Yes", icon: "check-circle" },
  { id: false, label: "No", icon: "cancel" },
];

/* ── Step Components ───────────────────────────────────── */

function ColorStep({ selected, onSelect }) {
  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} style={s.stepContent}>
      <Text style={s.stepTitle}>What color is your flow?</Text>
      <Text style={s.stepSubtitle}>
        Select the color closest to what you see
      </Text>
      <View style={s.optionsGrid}>
        {COLOR_OPTIONS.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={({ pressed }) => [
              s.colorCard,
              selected === opt.id && s.cardSelected,
              pressed && s.cardPressed,
            ]}
          >
            <View
              style={[s.colorCircle, { backgroundColor: opt.color }]}
            />
            <Text
              style={[
                s.optionLabel,
                selected === opt.id && s.optionLabelActive,
              ]}
            >
              {opt.label}
            </Text>
            <Text style={s.optionDesc}>{opt.description}</Text>
            {selected === opt.id && (
              <View style={s.checkBadge}>
                <MaterialIcons name="check" size={14} color="#fff" />
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

function FlowStep({ selected, onSelect }) {
  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} style={s.stepContent}>
      <Text style={s.stepTitle}>How heavy is your flow?</Text>
      <Text style={s.stepSubtitle}>
        This helps us understand your body's pattern
      </Text>
      <View style={s.flowRow}>
        {FLOW_OPTIONS.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={({ pressed }) => [
              s.flowCard,
              selected === opt.id && s.cardSelected,
              pressed && s.cardPressed,
            ]}
          >
            <View style={s.flowIconBubble}>
              <MaterialIcons
                name={opt.icon}
                size={28}
                color={selected === opt.id ? "#C9929B" : "#9A8A92"}
              />
            </View>
            <Text
              style={[
                s.optionLabel,
                selected === opt.id && s.optionLabelActive,
              ]}
            >
              {opt.label}
            </Text>
            <Text style={s.optionDesc}>{opt.description}</Text>
            {selected === opt.id && (
              <View style={s.checkBadge}>
                <MaterialIcons name="check" size={14} color="#fff" />
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

function ClotStep({ selected, onSelect }) {
  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} style={s.stepContent}>
      <Text style={s.stepTitle}>Are you noticing any clots?</Text>
      <Text style={s.stepSubtitle}>
        Small clots can be common — this helps personalize your insights
      </Text>
      <View style={s.clotRow}>
        {CLOT_OPTIONS.map((opt) => (
          <Pressable
            key={String(opt.id)}
            onPress={() => onSelect(opt.id)}
            style={({ pressed }) => [
              s.clotCard,
              selected === opt.id && s.cardSelected,
              pressed && s.cardPressed,
            ]}
          >
            <MaterialIcons
              name={opt.icon}
              size={36}
              color={selected === opt.id ? "#C9929B" : "#B8A0B0"}
            />
            <Text
              style={[
                s.clotLabel,
                selected === opt.id && s.optionLabelActive,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

/* ── Insight Result Card ───────────────────────────────── */

function InsightCard({ result, onDone }) {
  const isAttention = result.status === "needs_attention";

  return (
    <Animated.View entering={FadeInUp.duration(500).springify()} style={s.stepContent}>
      <View
        style={[
          s.insightBanner,
          isAttention ? s.insightAttention : s.insightNormal,
        ]}
      >
        <MaterialIcons
          name={isAttention ? "info-outline" : "check-circle"}
          size={22}
          color={isAttention ? "#C4784A" : "#6BA07A"}
        />
        <Text
          style={[
            s.insightStatusText,
            { color: isAttention ? "#C4784A" : "#6BA07A" },
          ]}
        >
          {result.statusLabel}
        </Text>
      </View>

      <Text style={s.insightText}>{result.insight}</Text>

      {result.nutrients && result.nutrients.length > 0 && (
        <View style={s.nutrientRow}>
          {result.nutrients.map((n) => (
            <View key={n} style={s.nutrientChip}>
              <Text style={s.nutrientText}>{n}</Text>
            </View>
          ))}
        </View>
      )}

      {result.wellness ? (
        <View style={s.wellnessCard}>
          <MaterialIcons name="spa" size={16} color="#B8A0C4" />
          <Text style={s.wellnessText}>{result.wellness}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={onDone}
        style={({ pressed }) => [s.doneBtn, pressed && { opacity: 0.85 }]}
      >
        <Text style={s.doneBtnText}>View Diet & Exercise Plan</Text>
        <MaterialIcons name="arrow-forward" size={18} color="#fff" />
      </Pressable>

      <Pressable
        onPress={onDone}
        style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
      >
        <Text style={s.backBtnText}>Back to Dashboard</Text>
      </Pressable>
    </Animated.View>
  );
}

/* ════════════════════════════════════════════════════════════════
   Blood Tracker Screen
   ════════════════════════════════════════════════════════════════ */

export default function BloodTracker() {
  const router = useRouter();
  const { user } = useAuth();
  const { cycleData } = useCycleStorage();

  const [step, setStep] = useState(0); // 0=color, 1=flow, 2=clots, 3=result
  const [color, setColor] = useState(null);
  const [flow, setFlow] = useState(null);
  const [clots, setClots] = useState(null);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Get current cycle phase
  const currentPhase = useMemo(() => {
    if (!cycleData) return "menstrual";
    try {
      return getPhase(new Date(), cycleData);
    } catch {
      return "menstrual";
    }
  }, [cycleData]);

  const canProceed =
    (step === 0 && color !== null) ||
    (step === 1 && flow !== null) ||
    (step === 2 && clots !== null);

  /* ── Submit & Analyze ── */
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Save to AsyncStorage
      const logEntry = {
        date: new Date().toISOString(),
        color,
        flow,
        clots,
        phase: currentPhase,
      };

      const existing = await AsyncStorage.getItem(BLOOD_LOG_KEY);
      const logs = existing ? JSON.parse(existing) : [];
      logs.unshift(logEntry);
      // Keep last 90 entries
      await AsyncStorage.setItem(
        BLOOD_LOG_KEY,
        JSON.stringify(logs.slice(0, 90))
      );

      // Call backend for analysis
      const analysisResult = await analyzeBlood({
        color,
        flow,
        clots,
        phase: currentPhase,
      });

      // Cache result for dietician screen
      await AsyncStorage.setItem(
        "@OVA_latestBloodAnalysis",
        JSON.stringify({ ...analysisResult, ...logEntry })
      );

      setResult(analysisResult);
      setStep(3);
    } catch (error) {
      console.warn("Blood analysis failed:", error);
      // Show offline fallback
      setResult({
        status: "normal",
        statusLabel: "Normal Pattern",
        insight:
          "We saved your log. Stay hydrated and nourish your body with iron-rich foods.",
        nutrients: ["Iron", "Vitamin C"],
        wellness: "Be gentle with yourself today.",
        source: "offline",
      });
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  }, [color, flow, clots, currentPhase]);

  const handleNext = useCallback(() => {
    if (step === 2) {
      handleSubmit();
    } else {
      setStep((prev) => prev + 1);
    }
  }, [step, handleSubmit]);

  const handleBack = useCallback(() => {
    if (step === 0) {
      router.back();
    } else if (step === 3) {
      // Reset
      setStep(0);
      setColor(null);
      setFlow(null);
      setClots(null);
      setResult(null);
    } else {
      setStep((prev) => prev - 1);
    }
  }, [step, router]);

  const handleDone = useCallback(() => {
    router.push("/(tabs)/dietician");
  }, [router]);

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
          <Pressable onPress={handleBack} style={s.backArrow}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#5B4B54" />
          </Pressable>
          <View>
            <Text style={s.headerTitle}>Your Blood Tracker</Text>
            <Text style={s.headerSubtitle}>
              {step < 3
                ? `Step ${step + 1} of 3`
                : "Your personalized insight"}
            </Text>
          </View>
        </View>

        {/* Progress Dots */}
        {step < 3 && (
          <View style={s.progressRow}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  s.progressDot,
                  i === step && s.progressDotActive,
                  i < step && s.progressDotDone,
                ]}
              />
            ))}
          </View>
        )}

        {/* Steps */}
        {step === 0 && <ColorStep selected={color} onSelect={setColor} />}
        {step === 1 && <FlowStep selected={flow} onSelect={setFlow} />}
        {step === 2 && <ClotStep selected={clots} onSelect={setClots} />}
        {step === 3 && result && (
          <InsightCard result={result} onDone={handleDone} />
        )}

        {/* Navigation Button */}
        {step < 3 && (
          <Pressable
            onPress={handleNext}
            disabled={!canProceed || isSubmitting}
            style={({ pressed }) => [
              s.nextBtn,
              !canProceed && s.nextBtnDisabled,
              pressed && canProceed && { opacity: 0.85 },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={s.nextBtnText}>
                  {step === 2 ? "Analyze" : "Continue"}
                </Text>
                <MaterialIcons
                  name={step === 2 ? "auto-awesome" : "arrow-forward"}
                  size={18}
                  color="#fff"
                />
              </>
            )}
          </Pressable>
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
    gap: 20,
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

  /* Progress */
  progressRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(201, 146, 155, 0.2)",
  },
  progressDotActive: {
    width: 28,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#C9929B",
  },
  progressDotDone: {
    backgroundColor: "#D4A0BC",
  },

  /* Step Content */
  stepContent: {
    gap: 14,
  },
  stepTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: "#4B3D45",
    textAlign: "center",
  },
  stepSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#7A6973",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 4,
  },

  /* Color Cards */
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  colorCard: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  cardSelected: {
    borderColor: "#C9929B",
    backgroundColor: "rgba(201, 146, 155, 0.08)",
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  optionLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#5B4B54",
  },
  optionLabelActive: {
    color: "#C9929B",
  },
  optionDesc: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#9A8A92",
    textAlign: "center",
  },
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#C9929B",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Flow Cards */
  flowRow: {
    flexDirection: "row",
    gap: 12,
  },
  flowCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  flowIconBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(201, 146, 155, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Clot Cards */
  clotRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  clotCard: {
    width: 140,
    height: 140,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  clotLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#5B4B54",
  },

  /* Insight Card */
  insightBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignSelf: "center",
  },
  insightNormal: {
    backgroundColor: "rgba(107, 160, 122, 0.1)",
  },
  insightAttention: {
    backgroundColor: "rgba(196, 120, 74, 0.1)",
  },
  insightStatusText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  insightText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "#5B4B54",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
    padding: 18,
  },
  nutrientRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  nutrientChip: {
    backgroundColor: "rgba(201, 146, 155, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  nutrientText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#C9929B",
  },
  wellnessCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(184, 160, 196, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  wellnessText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#5B4B54",
  },

  /* Buttons */
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#C9929B",
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 8,
    shadowColor: "#C9929B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  nextBtnDisabled: {
    backgroundColor: "rgba(201, 146, 155, 0.35)",
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#C9929B",
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 8,
    shadowColor: "#C9929B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  doneBtnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  backBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  backBtnText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#9A8A92",
  },
});
