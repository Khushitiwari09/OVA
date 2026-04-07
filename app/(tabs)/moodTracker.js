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
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { getMoodLogs, saveMoodLog } from "@/lib/database";

const MOOD_OPTIONS = [
  { label: "Happy", icon: "wb-sunny", color: "#8BB8A8" },
  { label: "Calm", icon: "spa", color: "#A8C8D8" },
  { label: "Energetic", icon: "bolt", color: "#D4B888" },
  { label: "Neutral", icon: "remove-circle-outline", color: "#B8A0B0" },
  { label: "Anxious", icon: "psychology", color: "#C4A8E0" },
  { label: "Irritated", icon: "whatshot", color: "#E0A8A8" },
  { label: "Sad", icon: "water-drop", color: "#A8B8D8" },
  { label: "Exhausted", icon: "nightlight-round", color: "#D4A89C" },
];

const MOOD_SCORES = {
  Happy: 5,
  Calm: 4,
  Energetic: 5,
  Neutral: 3,
  Anxious: 2,
  Irritated: 2,
  Sad: 1,
  Exhausted: 1,
};

const BAR_COLORS = {
  5: "#8BB8A8",
  4: "#A8C8D8",
  3: "#B8A0B0",
  2: "#C4A8E0",
  1: "#D4A89C",
};

function MoodBarChart({ moodLogs }) {
  if (!moodLogs || moodLogs.length === 0) {
    return (
      <View style={barStyles.emptyContainer}>
        <MaterialIcons
          name="bar-chart"
          size={32}
          color="rgba(139,108,128,0.3)"
        />
        <Text style={barStyles.emptyText}>
          Start logging moods to see your weekly trend
        </Text>
      </View>
    );
  }

  const maxScore = 5;

  return (
    <View style={barStyles.container}>
      <View style={barStyles.chartRow}>
        {moodLogs.map((log, i) => {
          const score = MOOD_SCORES[log.mood] || 3;
          const heightPercent = (score / maxScore) * 100;
          const dayLabel = new Date(log.log_date + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short",
          });

          return (
            <View key={log.id || i} style={barStyles.barColumn}>
              <View style={barStyles.barTrack}>
                <View
                  style={[
                    barStyles.barFill,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor: BAR_COLORS[score] || "#B8A0B0",
                    },
                  ]}
                />
              </View>
              <Text style={barStyles.dayLabel}>{dayLabel}</Text>
            </View>
          );
        })}
      </View>

      <View style={barStyles.legendRow}>
        <Text style={barStyles.legendText}>Low</Text>
        <View style={barStyles.legendLine} />
        <Text style={barStyles.legendText}>High</Text>
      </View>
    </View>
  );
}

export default function MoodTrackerScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [moodLogs, setMoodLogs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Load mood logs
  useEffect(() => {
    if (user) {
      loadMoodLogs();
    } else {
      setLoadingLogs(false);
    }
  }, [user]);

  const loadMoodLogs = async () => {
    try {
      const logs = await getMoodLogs(user.id, 7);
      setMoodLogs(logs);
    } catch (e) {
      console.warn("Failed to load moods:", e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSave = useCallback(async () => {
    if (!selectedMood) return;

    setSaving(true);
    const today = new Date().toISOString().split("T")[0];

    try {
      if (user) {
        await saveMoodLog(user.id, today, selectedMood, note);
        await loadMoodLogs();
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.warn("Failed to save mood:", e);
    } finally {
      setSaving(false);
    }
  }, [selectedMood, note, user]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#FDF5F7", "#F5EEF8", "#F0EAF3", "#EDE8EE"]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <MaterialIcons name="arrow-back-ios" size={18} color="#7A6170" />
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>
            Your feelings matter. Let's track them gently.
          </Text>
        </View>

        {/* Mood Selection */}
        <View style={styles.moodGrid}>
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.label;
            return (
              <Pressable
                key={mood.label}
                onPress={() => setSelectedMood(mood.label)}
                style={({ pressed }) => [
                  styles.moodChip,
                  isSelected && [
                    styles.moodChipSelected,
                    { backgroundColor: mood.color },
                  ],
                  pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
                ]}
              >
                <MaterialIcons
                  name={mood.icon}
                  size={22}
                  color={isSelected ? "#FFFFFF" : mood.color}
                />
                <Text
                  style={[
                    styles.moodChipText,
                    isSelected && styles.moodChipTextSelected,
                  ]}
                >
                  {mood.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Note */}
        {selectedMood ? (
          <View style={styles.noteCard}>
            <Text style={styles.noteLabel}>Want to add a note?</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="How your day is going..."
              placeholderTextColor="#C4B8BE"
              multiline
              maxLength={200}
            />

            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={({ pressed }) => [
                styles.saveBtn,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                saving && { opacity: 0.7 },
              ]}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons
                    name={saved ? "check-circle" : "favorite"}
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={styles.saveBtnText}>
                    {saved ? "Saved!" : "Log Mood"}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        ) : null}

        {/* Weekly Graph */}
        <View style={styles.graphSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="show-chart" size={20} color="#8B6C80" />
            <Text style={styles.sectionTitle}>Your Week</Text>
          </View>

          {loadingLogs ? (
            <ActivityIndicator
              size="small"
              color="#D4A0BC"
              style={{ paddingVertical: 40 }}
            />
          ) : (
            <MoodBarChart moodLogs={moodLogs} />
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const barStyles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 24,
    padding: 20,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 140,
    gap: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  barTrack: {
    width: "70%",
    height: "100%",
    backgroundColor: "rgba(200,180,190,0.1)",
    borderRadius: 10,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    borderRadius: 10,
    minHeight: 8,
  },
  dayLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
    color: "#9A8A92",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
  },
  legendLine: {
    flex: 1,
    maxWidth: 80,
    height: 1,
    backgroundColor: "rgba(200,180,190,0.3)",
  },
  legendText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: "#B8A0B0",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "rgba(139,108,128,0.5)",
    textAlign: "center",
  },
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 20,
  },
  topBar: { flexDirection: "row" },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 6,
  },
  header: { gap: 6 },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: "#4B3D45",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#9A8A92",
    lineHeight: 22,
  },

  // Mood grid
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  moodChip: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1.5,
    borderColor: "rgba(200,180,190,0.15)",
  },
  moodChipSelected: {
    borderColor: "transparent",
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  moodChipText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#6D5C65",
  },
  moodChipTextSelected: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
  },

  // Note
  noteCard: {
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 26,
    padding: 22,
    gap: 14,
  },
  noteLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#6D5C65",
  },
  noteInput: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#4B3D45",
    backgroundColor: "rgba(253,245,247,0.8)",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1.5,
    borderColor: "rgba(200,180,190,0.15)",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#D4A0BC",
    borderRadius: 22,
    paddingVertical: 15,
    shadowColor: "#D4879E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  saveBtnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },

  // Graph section
  graphSection: { gap: 14 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#5B4B54",
  },
});
