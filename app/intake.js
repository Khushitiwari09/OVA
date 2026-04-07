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
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";

const SYMPTOM_OPTIONS = [
  "Cramps",
  "Bloating",
  "Headache",
  "Fatigue",
  "Acne",
  "Mood Swings",
  "Back Pain",
  "Breast Tenderness",
];

const REGULARITY_OPTIONS = ["Regular", "Slightly Irregular", "Irregular"];
const FLOW_OPTIONS = ["Light", "Moderate", "Heavy"];

function StepDots({ current, total }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i <= current && styles.dotActive]}
        />
      ))}
    </View>
  );
}

function OptionChips({ options, value, onChange }) {
  return (
    <View style={styles.chipsWrap}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text
              style={[styles.chipLabel, selected && styles.chipLabelSelected]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MultiSelectChips({ options, selectedValues, onToggle }) {
  return (
    <View style={styles.chipsWrap}>
      {options.map((option) => {
        const selected = selectedValues.includes(option);
        return (
          <Pressable
            key={option}
            onPress={() => onToggle(option)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text
              style={[styles.chipLabel, selected && styles.chipLabelSelected]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function IconInputField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputIconBubble}>
          <MaterialIcons name={icon} size={18} color="#765E6B" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A89AA0"
          style={styles.input}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

export default function IntakeScreen() {
  const router = useRouter();
  const { updateProfile, user } = useAuth();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodDuration, setPeriodDuration] = useState("5");
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [regularity, setRegularity] = useState("");
  const [flowIntensity, setFlowIntensity] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const validateStep = () => {
    setError("");
    if (step === 0) {
      if (!name.trim()) { setError("Please enter your name"); return false; }
      if (!age || Number(age) < 10 || Number(age) > 60) {
        setError("Please enter a valid age (10–60)");
        return false;
      }
      return true;
    }
    if (step === 1) {
      if (!lastPeriodDate) {
        setError("Please select your last period date");
        return false;
      }
      const cl = Number(cycleLength);
      if (!cl || cl < 18 || cl > 45) {
        setError("Cycle length should be between 18 and 45");
        return false;
      }
      const pd = Number(periodDuration);
      if (!pd || pd < 1 || pd > 10) {
        setError("Period duration should be between 1 and 10");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleFinish = async () => {
    if (!regularity || !flowIntensity) {
      setError("Please complete all selections");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await updateProfile({
        name: name.trim(),
        age: Number(age),
        cycle_length: Number(cycleLength),
        period_duration: Number(periodDuration),
        last_period_date: lastPeriodDate,
        regularity,
        flow_intensity: flowIntensity,
      });
      // Auth context will detect profile change and route to dashboard
    } catch (e) {
      setError(e.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#FDF5F7", "#F8EEF5", "#F3EAF0"]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerSection}>
          <Text style={styles.overline}>Profile Setup</Text>
          <Text style={styles.title}>
            {step === 0
              ? "Let's get to know you"
              : step === 1
              ? "Tell us about your cycle"
              : "A few more details"}
          </Text>
          <Text style={styles.subtitle}>
            Let's understand your body gently
          </Text>
          <StepDots current={step} total={3} />
        </View>

        <View style={styles.formCard}>
          {/* Step 0: Name + Age */}
          {step === 0 && (
            <>
              <IconInputField
                icon="person-outline"
                label="Your Name"
                value={name}
                onChangeText={setName}
                placeholder="What should we call you?"
              />
              <IconInputField
                icon="cake"
                label="Age"
                value={age}
                onChangeText={setAge}
                placeholder="Your age"
                keyboardType="numeric"
              />
            </>
          )}

          {/* Step 1: Cycle data */}
          {step === 1 && (
            <>
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Last Period Start Date</Text>
                <TouchableOpacity
                  style={styles.calendarPicker}
                  onPress={() => setCalendarVisible(true)}
                >
                  <View style={styles.inputIconBubble}>
                    <MaterialIcons
                      name="calendar-month"
                      size={18}
                      color="#765E6B"
                    />
                  </View>
                  <Text style={styles.calendarPickerText}>
                    {lastPeriodDate || "Pick from calendar"}
                  </Text>
                </TouchableOpacity>
              </View>

              <IconInputField
                icon="calendar-view-week"
                label="Cycle Length (days)"
                value={cycleLength}
                onChangeText={setCycleLength}
                placeholder="e.g. 28"
                keyboardType="numeric"
              />

              <IconInputField
                icon="water-drop"
                label="Period Duration (days)"
                value={periodDuration}
                onChangeText={setPeriodDuration}
                placeholder="e.g. 5"
                keyboardType="numeric"
              />
            </>
          )}

          {/* Step 2: Additional details */}
          {step === 2 && (
            <>
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Cycle Regularity</Text>
                <OptionChips
                  options={REGULARITY_OPTIONS}
                  value={regularity}
                  onChange={setRegularity}
                />
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Flow Intensity</Text>
                <OptionChips
                  options={FLOW_OPTIONS}
                  value={flowIntensity}
                  onChange={setFlowIntensity}
                />
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Common Symptoms</Text>
                <MultiSelectChips
                  options={SYMPTOM_OPTIONS}
                  selectedValues={selectedSymptoms}
                  onToggle={toggleSymptom}
                />
              </View>
            </>
          )}

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {/* Navigation */}
          <View style={styles.btnRow}>
            {step > 0 && (
              <Pressable
                onPress={() => { setStep(step - 1); setError(""); }}
                style={({ pressed }) => [
                  styles.backBtn,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={18}
                  color="#6D5C65"
                />
              </Pressable>
            )}

            <Pressable
              onPress={step < 2 ? handleNext : handleFinish}
              disabled={saving}
              style={({ pressed }) => [
                styles.nextBtn,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                saving && { opacity: 0.7 },
              ]}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.nextBtnText}>
                  {step < 2 ? "Continue" : "Get Started"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Calendar Modal */}
        <Modal
          visible={calendarVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCalendarVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.calendarModalCard}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>
                  Select Last Period Date
                </Text>
                <TouchableOpacity
                  onPress={() => setCalendarVisible(false)}
                >
                  <MaterialIcons name="close" size={20} color="#6B5964" />
                </TouchableOpacity>
              </View>
              <Calendar
                onDayPress={(day) => {
                  setLastPeriodDate(day.dateString);
                  setCalendarVisible(false);
                }}
                markedDates={
                  lastPeriodDate
                    ? {
                        [lastPeriodDate]: {
                          selected: true,
                          selectedColor: "#D8BEC9",
                        },
                      }
                    : {}
                }
                maxDate={new Date().toISOString().split("T")[0]}
                theme={{
                  backgroundColor: "#FFF9FB",
                  calendarBackground: "#FFF9FB",
                  textSectionTitleColor: "#8C7A84",
                  selectedDayBackgroundColor: "#D8BEC9",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#8B6580",
                  dayTextColor: "#63535D",
                  textDisabledColor: "#CFBCC6",
                  monthTextColor: "#5C4D56",
                  arrowColor: "#7C6573",
                  textDayFontFamily: "Poppins_400Regular",
                  textMonthFontFamily: "Poppins_600SemiBold",
                  textDayHeaderFontFamily: "Poppins_500Medium",
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 12,
                }}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 20,
  },
  headerSection: { gap: 6 },
  overline: {
    fontFamily: "Poppins_500Medium",
    color: "#8E7F87",
    fontSize: 13,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
    lineHeight: 34,
    color: "#4B3D45",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    color: "#9A8A92",
    lineHeight: 22,
    fontSize: 14,
  },

  // Step dots
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(200,180,190,0.25)",
  },
  dotActive: {
    backgroundColor: "#D4A0BC",
    shadowColor: "#D4879E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },

  // Form
  formCard: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.65)",
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  fieldWrap: { marginBottom: 18 },
  fieldLabel: {
    fontFamily: "Poppins_500Medium",
    color: "#6D5C65",
    fontSize: 13,
    marginBottom: 8,
  },
  inputRow: {
    borderRadius: 18,
    backgroundColor: "rgba(253,245,247,0.8)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "rgba(200,180,190,0.15)",
  },
  inputIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: "rgba(212,160,188,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 14,
    color: "#4B3D45",
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
  },
  calendarPicker: {
    borderRadius: 18,
    backgroundColor: "rgba(253,245,247,0.8)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "rgba(200,180,190,0.15)",
  },
  calendarPickerText: {
    fontFamily: "Poppins_400Regular",
    color: "#5A4C55",
    fontSize: 15,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 18,
    backgroundColor: "rgba(253,245,247,0.8)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "rgba(200,180,190,0.15)",
  },
  chipSelected: {
    backgroundColor: "#D4A0BC",
    borderColor: "#D4A0BC",
  },
  chipLabel: {
    fontFamily: "Poppins_500Medium",
    color: "#6D5C65",
    fontSize: 13,
  },
  chipLabelSelected: {
    color: "#FFFFFF",
  },
  errorText: {
    marginBottom: 10,
    color: "#C45A6E",
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    textAlign: "center",
  },

  // Buttons
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(200,180,190,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D4A0BC",
    borderRadius: 22,
    paddingVertical: 16,
    shadowColor: "#D4879E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  nextBtnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },

  // Calendar modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(52, 39, 49, 0.28)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  calendarModalCard: {
    borderRadius: 24,
    backgroundColor: "#FFF9FB",
    padding: 14,
    shadowColor: "#4D3D46",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 26,
    elevation: 12,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 6,
    paddingTop: 4,
  },
  calendarTitle: {
    fontFamily: "Poppins_600SemiBold",
    color: "#5D4E57",
    fontSize: 16,
  },
});
