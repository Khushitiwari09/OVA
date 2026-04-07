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
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CycleCalendar } from "@/components/cycle-tracker/CycleCalendar";
import { EditCycleModal } from "@/components/cycle-tracker/EditCycleModal";
import { PhaseHelperCard } from "@/components/cycle-tracker/PhaseHelperCard";
import { QuestionCard } from "@/components/cycle-tracker/QuestionCard";
import { useCycleStorage } from "@/hooks/useCycleStorage";
import {
  getFertileWindow,
  getNextPeriodDate,
  getOvulationDay,
  getPhaseInfo,
  toDateString,
} from "@/utils/cycleCalculations";

// ──────────────────────────────────────────────────────────
// Health-logging question sets
// ──────────────────────────────────────────────────────────

const PHYSICAL_QUESTIONS = [
  {
    id: "pain",
    question: "How is your pain level today?",
    subtitle: "Let's keep track so we can notice patterns together.",
    options: ["None", "Mild", "Moderate", "Severe"],
    color: "#E8889A",
    multiSelect: false,
  },
  {
    id: "flow",
    question: "How would you describe your flow?",
    subtitle: "Every body is different — no judgement here.",
    options: ["Light", "Medium", "Heavy", "Spotting"],
    color: "#D98BA0",
    multiSelect: false,
  },
  {
    id: "skin",
    question: "How is your skin feeling?",
    subtitle: "Skin changes are completely normal during your cycle.",
    options: ["Clear", "Acne", "Oily", "Dry"],
    color: "#CC8FA3",
    multiSelect: true,
  },
  {
    id: "energy",
    question: "What's your energy level?",
    subtitle: "This helps us understand your body rhythm.",
    options: ["High", "Normal", "Low", "Exhausted"],
    color: "#D4909F",
    multiSelect: false,
  },
];

const EMOTIONAL_QUESTIONS = [
  {
    id: "mood",
    question: "How are you feeling emotionally?",
    subtitle: "Your feelings are valid, always.",
    options: ["Happy", "Calm", "Anxious", "Irritated", "Sad", "Sensitive"],
    color: "#B9A0D4",
    multiSelect: true,
  },
  {
    id: "cravings",
    question: "Any cravings today?",
    subtitle: "Cravings can tell us a lot about what your body needs.",
    options: ["Sweet", "Salty", "Spicy", "Carbs", "No cravings"],
    color: "#C4A8E0",
    multiSelect: true,
  },
  {
    id: "sleep",
    question: "How was your sleep?",
    subtitle: "Good rest is foundational for wellbeing.",
    options: ["Great", "Good", "Fair", "Poor"],
    color: "#A896C8",
    multiSelect: false,
  },
];

const GENERAL_QUESTIONS = [
  {
    id: "bloating",
    question: "Experiencing any bloating?",
    subtitle: "Totally normal — let's note it down.",
    options: ["None", "Mild", "Moderate", "Severe"],
    color: "#D4A89C",
    multiSelect: false,
  },
  {
    id: "stress",
    question: "How's your stress level?",
    subtitle: "Being aware is the first step to managing it.",
    options: ["Relaxed", "Moderate", "High", "Overwhelmed"],
    color: "#C9A892",
    multiSelect: false,
  },
  {
    id: "activity",
    question: "How active were you today?",
    subtitle: "Every little movement counts.",
    options: ["Intense", "Moderate", "Light", "Rest day"],
    color: "#BDA28E",
    multiSelect: false,
  },
];

// ──────────────────────────────────────────────────────────
// Decorative background
// ──────────────────────────────────────────────────────────

function DecoBackground() {
  return (
    <View style={styles.decoContainer} pointerEvents="none">
      <View style={[styles.decoCircle, styles.decoCircle1]} />
      <View style={[styles.decoCircle, styles.decoCircle2]} />
      <View style={[styles.decoCircle, styles.decoCircle3]} />
      <View style={[styles.decoFloral, styles.decoFloral1]} />
      <View style={[styles.decoFloral, styles.decoFloral2]} />
      <View style={[styles.decoFloral, styles.decoFloral3]} />
      <View style={[styles.decoFloral, styles.decoFloral4]} />
    </View>
  );
}

// ──────────────────────────────────────────────────────────
// Logging phase tab
// ──────────────────────────────────────────────────────────

function LoggingPhaseTab({ label, active, onPress, icon }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.phaseTab,
        active && styles.phaseTabActive,
        pressed && { opacity: 0.8 },
      ]}
    >
      <MaterialIcons
        name={icon}
        size={16}
        color={active ? "#FFFFFF" : "#9A8A92"}
      />
      <Text style={[styles.phaseTabText, active && styles.phaseTabTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ──────────────────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────────────────

export default function CycleTracker() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // ── Persistent cycle data (AsyncStorage)
  const { cycleData, isLoading, updateCycleData } = useCycleStorage();

  const [selectedDate, setSelectedDate] = useState(null);
  const [activeLoggingPhase, setActiveLoggingPhase] = useState("physical");
  const [answers, setAnswers] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  // ── Derived predictions (recalculate instantly when cycleData changes)
  const nextPeriodDate = useMemo(() => {
    if (!cycleData) return null;
    return getNextPeriodDate(cycleData);
  }, [cycleData]);

  const ovulationDay = useMemo(() => {
    if (!cycleData) return null;
    return getOvulationDay(cycleData);
  }, [cycleData]);

  const fertileWindow = useMemo(() => {
    if (!cycleData) return null;
    return getFertileWindow(cycleData);
  }, [cycleData]);

  const daysUntilPeriod = useMemo(() => {
    if (!nextPeriodDate) return 0;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = Math.ceil(
      (nextPeriodDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, diff);
  }, [nextPeriodDate]);

  const formattedNextPeriod = nextPeriodDate
    ? nextPeriodDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const formattedOvulation = ovulationDay
    ? ovulationDay.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      })
    : "—";

  const formattedFertile = fertileWindow
    ? `${fertileWindow.start.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      })} – ${fertileWindow.end.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      })}`
    : "—";

  // ── Phase info for selected date
  const selectedPhaseInfo = useMemo(() => {
    if (!selectedDate || !cycleData) return null;
    return getPhaseInfo(selectedDate, cycleData);
  }, [selectedDate, cycleData]);

  // ── Handlers
  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setActiveLoggingPhase("physical");
  }, []);

  const handleCycleUpdate = useCallback(
    (newData) => {
      updateCycleData(newData); // saves to AsyncStorage
      setSelectedDate(null);
    },
    [updateCycleData]
  );

  const handleAnswer = useCallback(
    (questionId, values) => {
      const dateKey = selectedDate
        ? toDateString(selectedDate)
        : "none";
      setAnswers((prev) => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [questionId]: values,
        },
      }));
    },
    [selectedDate]
  );

  const getAnswersForDate = useCallback(
    (questionId) => {
      const dateKey = selectedDate
        ? toDateString(selectedDate)
        : "none";
      return answers[dateKey]?.[questionId] || [];
    },
    [selectedDate, answers]
  );

  const currentQuestions =
    activeLoggingPhase === "physical"
      ? PHYSICAL_QUESTIONS
      : activeLoggingPhase === "emotional"
      ? EMOTIONAL_QUESTIONS
      : GENERAL_QUESTIONS;

  // ── Loading state
  if (!fontsLoaded || isLoading || !cycleData) {
    return (
      <View style={styles.loadingScreen}>
        <LinearGradient
          colors={["#FDF5F7", "#F8EEF5", "#F3EAF0", "#F0E8EC"]}
          style={StyleSheet.absoluteFillObject}
        />
        <ActivityIndicator size="large" color="#D4A0BC" />
        <Text style={styles.loadingText}>Loading your cycle data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#FDF5F7", "#F8EEF5", "#F3EAF0", "#F0E8EC"]}
        style={StyleSheet.absoluteFillObject}
      />
      <DecoBackground />

      {/* Edit Modal */}
      <EditCycleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        cycleData={cycleData}
        onSave={handleCycleUpdate}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top bar */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <MaterialIcons name="arrow-back-ios" size={18} color="#7A6170" />
          </Pressable>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [
              styles.editButton,
              pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
            ]}
          >
            <MaterialIcons name="tune" size={17} color="#8B6C80" />
            <Text style={styles.editButtonText}>Edit Cycle</Text>
          </Pressable>
        </View>

        {/* ── Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cycle</Text>
          <Text style={styles.headerSubtitle}>
            Understanding your body gently
          </Text>
        </View>

        {/* ── Calendar (react-native-calendars) */}
        <CycleCalendar
          lastPeriodDate={cycleData.lastPeriodDate}
          cycleLength={cycleData.cycleLength}
          periodDuration={cycleData.periodDuration}
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
        />

        {/* ── Prediction Card */}
        <LinearGradient
          colors={["#EDD5E0", "#E0CDE8", "#ECDDD0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.predictionCard}
        >
          <View style={styles.predictionHeader}>
            <MaterialIcons name="auto-awesome" size={20} color="#8B6C80" />
            <Text style={styles.predictionLabel}>Cycle Prediction</Text>
          </View>

          <View style={styles.predictionRow}>
            <View style={styles.predictionItem}>
              <Text style={styles.predictionItemLabel}>Next Period</Text>
              <Text style={styles.predictionItemValue}>
                {formattedNextPeriod}
              </Text>
              <Text style={styles.predictionItemSub}>
                {daysUntilPeriod > 0
                  ? `in ${daysUntilPeriod} days`
                  : "Due today"}
              </Text>
            </View>
            <View style={styles.predictionDivider} />
            <View style={styles.predictionItem}>
              <Text style={styles.predictionItemLabel}>Cycle Length</Text>
              <Text style={styles.predictionItemValue}>
                {cycleData.cycleLength} days
              </Text>
              <Text style={styles.predictionItemSub}>
                Period: {cycleData.periodDuration} days
              </Text>
            </View>
          </View>

          {/* Ovulation + fertile pills */}
          <View style={styles.predictionExtraRow}>
            <View style={styles.predictionPill}>
              <MaterialIcons name="auto-awesome" size={13} color="#6B4D8A" />
              <Text style={styles.predictionPillText}>
                Ovulation ~{formattedOvulation}
              </Text>
            </View>
            <View style={styles.predictionPill}>
              <MaterialIcons name="local-florist" size={13} color="#7B63A0" />
              <Text style={styles.predictionPillText}>
                Fertile {formattedFertile}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Phase Helper Card */}
        {selectedPhaseInfo && (
          <View>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info-outline" size={18} color="#8B6C80" />
              <Text style={styles.sectionHeaderText}>Phase Helper Guide</Text>
            </View>
            <PhaseHelperCard phaseInfo={selectedPhaseInfo} />
          </View>
        )}

        {/* ── Health Logging */}
        {selectedDate && (
          <View style={styles.loggingSection}>
            <View style={styles.loggingHeader}>
              <MaterialIcons name="edit-note" size={22} color="#8B6C80" />
              <View>
                <Text style={styles.loggingTitle}>
                  How are you feeling today?
                </Text>
                <Text style={styles.loggingSubtitle}>
                  Let's understand your body better
                </Text>
              </View>
            </View>

            <Text style={styles.loggingDate}>
              Logging for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>

            {/* Logging Phase Tabs */}
            <View style={styles.phaseTabRow}>
              <LoggingPhaseTab
                label="Physical"
                icon="favorite-border"
                active={activeLoggingPhase === "physical"}
                onPress={() => setActiveLoggingPhase("physical")}
              />
              <LoggingPhaseTab
                label="Emotional"
                icon="psychology"
                active={activeLoggingPhase === "emotional"}
                onPress={() => setActiveLoggingPhase("emotional")}
              />
              <LoggingPhaseTab
                label="General"
                icon="spa"
                active={activeLoggingPhase === "general"}
                onPress={() => setActiveLoggingPhase("general")}
              />
            </View>

            {/* Question Cards */}
            {currentQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q.question}
                subtitle={q.subtitle}
                options={q.options}
                selectedValues={getAnswersForDate(q.id)}
                onSelect={(values) => handleAnswer(q.id, values)}
                color={q.color}
                multiSelect={q.multiSelect}
              />
            ))}

            <View style={styles.savePrompt}>
              <Text style={styles.savePromptText}>
                Your responses are saved automatically
              </Text>
              <MaterialIcons name="cloud-done" size={16} color="#B8A0B0" />
            </View>
          </View>
        )}

        {/* ── Empty state */}
        {!selectedDate && (
          <View style={styles.emptyPrompt}>
            <MaterialIcons
              name="touch-app"
              size={32}
              color="rgba(139, 108, 128, 0.4)"
            />
            <Text style={styles.emptyPromptText}>
              Tap a date on the calendar to see your phase and start logging
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ──────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#9A8A92",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 20,
  },

  // ── Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B8A0B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    paddingLeft: 6,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    shadowColor: "#B8A0B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  editButtonText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#6D5466",
  },

  // ── Header
  header: {
    gap: 6,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 30,
    color: "#4B3D45",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
    color: "#9A8A92",
    lineHeight: 22,
  },

  // ── Prediction Card
  predictionCard: {
    borderRadius: 26,
    padding: 22,
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 7,
  },
  predictionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  predictionLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#6D5466",
  },
  predictionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  predictionItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  predictionItemLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#8A7280",
  },
  predictionItemValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#4B3D45",
  },
  predictionItemSub: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#9A8590",
  },
  predictionDivider: {
    width: 1,
    height: 48,
    backgroundColor: "rgba(139, 108, 128, 0.15)",
  },
  predictionExtraRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
  },
  predictionPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    minWidth: 130,
  },
  predictionPillText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    color: "#6D5466",
  },

  // ── Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#5B4B54",
  },

  // ── Health Logging
  loggingSection: {
    gap: 14,
  },
  loggingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loggingTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#5B4B54",
  },
  loggingSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#9A8A92",
    marginTop: 1,
  },
  loggingDate: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#B8A0B0",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },

  // ── Logging phase tabs
  phaseTabRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 4,
  },
  phaseTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(200, 180, 190, 0.2)",
  },
  phaseTabActive: {
    backgroundColor: "#D4A0BC",
    borderColor: "#D4A0BC",
    shadowColor: "#D4879E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  phaseTabText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#9A8A92",
  },
  phaseTabTextActive: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
  },

  // ── Save prompt
  savePrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  savePromptText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#B8A0B0",
  },

  // ── Empty state
  emptyPrompt: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 32,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(200, 180, 190, 0.15)",
    borderStyle: "dashed",
  },
  emptyPromptText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "rgba(139, 108, 128, 0.5)",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  // ── Decorative background
  decoContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  decoCircle: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1.5,
  },
  decoCircle1: {
    width: 220,
    height: 220,
    top: -40,
    right: -60,
    borderColor: "rgba(232, 180, 203, 0.07)",
    backgroundColor: "rgba(232, 180, 203, 0.03)",
  },
  decoCircle2: {
    width: 180,
    height: 180,
    bottom: 120,
    left: -50,
    borderColor: "rgba(196, 168, 224, 0.06)",
    backgroundColor: "rgba(196, 168, 224, 0.02)",
  },
  decoCircle3: {
    width: 140,
    height: 140,
    top: 350,
    right: -30,
    borderColor: "rgba(212, 168, 156, 0.06)",
    backgroundColor: "rgba(212, 168, 156, 0.02)",
  },
  decoFloral: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(232, 180, 203, 0.06)",
  },
  decoFloral1: {
    width: 12,
    height: 12,
    top: 100,
    right: 40,
  },
  decoFloral2: {
    width: 8,
    height: 8,
    top: 200,
    left: 30,
    backgroundColor: "rgba(196, 168, 224, 0.06)",
  },
  decoFloral3: {
    width: 10,
    height: 10,
    top: 500,
    right: 60,
    backgroundColor: "rgba(212, 168, 156, 0.06)",
  },
  decoFloral4: {
    width: 14,
    height: 14,
    top: 700,
    left: 50,
    backgroundColor: "rgba(232, 180, 203, 0.05)",
  },
});
