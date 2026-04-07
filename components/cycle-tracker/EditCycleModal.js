import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export function EditCycleModal({ visible, onClose, cycleData, onSave }) {
  const [lastPeriod, setLastPeriod] = useState(new Date());
  const [cycleLen, setCycleLen] = useState("28");
  const [duration, setDuration] = useState("5");
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  // Seed fields when modal opens
  useEffect(() => {
    if (visible && cycleData) {
      setLastPeriod(new Date(cycleData.lastPeriodDate));
      setCycleLen(String(cycleData.cycleLength));
      setDuration(String(cycleData.periodDuration));
      setError("");
      setShowPicker(false);
    }
  }, [visible, cycleData]);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      setLastPeriod(selectedDate);
    }
  };

  const formatDate = (d) => {
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSave = () => {
    const cl = parseInt(cycleLen, 10);
    const pd = parseInt(duration, 10);

    if (!cl || cl < 18 || cl > 45) {
      setError("Cycle length should be between 18 and 45 days");
      return;
    }
    if (!pd || pd < 1 || pd > 10) {
      setError("Period duration should be between 1 and 10 days");
      return;
    }
    if (lastPeriod > new Date()) {
      setError("Last period date cannot be in the future");
      return;
    }

    onSave({
      lastPeriodDate: lastPeriod,
      cycleLength: cl,
      periodDuration: pd,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Close */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && { opacity: 0.6 },
              ]}
            >
              <MaterialIcons name="close" size={20} color="#9A8A92" />
            </Pressable>

            <Text style={styles.title}>Edit Cycle Data</Text>
            <Text style={styles.subtitle}>
              Update your details — the calendar will refresh instantly.
            </Text>

            {/* ── Last Period Date (date picker) */}
            <View style={styles.field}>
              <Text style={styles.label}>Last Period Start Date</Text>
              <Pressable
                onPress={() => setShowPicker(true)}
                style={({ pressed }) => [
                  styles.dateButton,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <MaterialIcons
                  name="calendar-today"
                  size={18}
                  color="#8B6C80"
                />
                <Text style={styles.dateButtonText}>
                  {formatDate(lastPeriod)}
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={22}
                  color="#9A8A92"
                />
              </Pressable>

              {showPicker && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={lastPeriod}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    themeVariant="light"
                    style={Platform.OS === "ios" ? styles.iosPicker : undefined}
                  />
                  {Platform.OS === "ios" && (
                    <Pressable
                      onPress={() => setShowPicker(false)}
                      style={styles.pickerDone}
                    >
                      <Text style={styles.pickerDoneText}>Done</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>

            {/* ── Cycle Length */}
            <View style={styles.field}>
              <Text style={styles.label}>Cycle Length (days)</Text>
              <View style={styles.numberRow}>
                <Pressable
                  onPress={() => {
                    const v = Math.max(18, parseInt(cycleLen || "28", 10) - 1);
                    setCycleLen(String(v));
                  }}
                  style={styles.stepBtn}
                >
                  <MaterialIcons name="remove" size={18} color="#8B6C80" />
                </Pressable>
                <TextInput
                  style={styles.numberInput}
                  value={cycleLen}
                  onChangeText={setCycleLen}
                  keyboardType="number-pad"
                  maxLength={2}
                  textAlign="center"
                />
                <Pressable
                  onPress={() => {
                    const v = Math.min(45, parseInt(cycleLen || "28", 10) + 1);
                    setCycleLen(String(v));
                  }}
                  style={styles.stepBtn}
                >
                  <MaterialIcons name="add" size={18} color="#8B6C80" />
                </Pressable>
              </View>
            </View>

            {/* ── Period Duration */}
            <View style={styles.field}>
              <Text style={styles.label}>Period Duration (days)</Text>
              <View style={styles.numberRow}>
                <Pressable
                  onPress={() => {
                    const v = Math.max(1, parseInt(duration || "5", 10) - 1);
                    setDuration(String(v));
                  }}
                  style={styles.stepBtn}
                >
                  <MaterialIcons name="remove" size={18} color="#8B6C80" />
                </Pressable>
                <TextInput
                  style={styles.numberInput}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="number-pad"
                  maxLength={2}
                  textAlign="center"
                />
                <Pressable
                  onPress={() => {
                    const v = Math.min(10, parseInt(duration || "5", 10) + 1);
                    setDuration(String(v));
                  }}
                  style={styles.stepBtn}
                >
                  <MaterialIcons name="add" size={18} color="#8B6C80" />
                </Pressable>
              </View>
            </View>

            {/* Error */}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Save */}
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveBtn,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
            >
              <MaterialIcons name="check-circle" size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Update Cycle</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(75, 61, 69, 0.45)",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    width: "100%",
    backgroundColor: "#FDF5F7",
    borderRadius: 28,
    padding: 26,
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 12,
  },
  closeBtn: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(200, 180, 190, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: "#4B3D45",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#9A8A92",
    marginBottom: 22,
    lineHeight: 20,
  },

  // ── Fields
  field: {
    marginBottom: 18,
  },
  label: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#6D5C65",
    marginBottom: 8,
  },

  // ── Date picker
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "rgba(200, 180, 190, 0.25)",
  },
  dateButtonText: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: "#4B3D45",
  },
  pickerContainer: {
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 18,
    overflow: "hidden",
  },
  iosPicker: {
    height: 180,
  },
  pickerDone: {
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(200, 180, 190, 0.2)",
  },
  pickerDoneText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#D4A0BC",
  },

  // ── Number stepper
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(232, 180, 203, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  numberInput: {
    flex: 1,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: "#4B3D45",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 18,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "rgba(200, 180, 190, 0.25)",
  },

  error: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#D45F5F",
    marginBottom: 12,
    textAlign: "center",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#D4A0BC",
    borderRadius: 22,
    paddingVertical: 15,
    marginTop: 4,
    shadowColor: "#D4879E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  saveBtnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});
