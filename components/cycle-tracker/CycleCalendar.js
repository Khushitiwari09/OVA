import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { buildMarkedDates, toDateString } from "@/utils/cycleCalculations";

/**
 * CycleCalendar — wraps react-native-calendars <Calendar /> with
 * dynamic cycle-phase marking and the app's pastel theme.
 */
export function CycleCalendar({
  lastPeriodDate,
  cycleLength = 28,
  periodDuration = 5,
  selectedDate,
  onSelectDate,
}) {
  // ── Build marked dates from cycle data
  const markedDates = useMemo(() => {
    const marks = buildMarkedDates({
      lastPeriodDate,
      cycleLength,
      periodDuration,
    });

    // Layer on selected-date styling
    if (selectedDate) {
      const selKey = toDateString(selectedDate);
      if (marks[selKey]) {
        marks[selKey] = {
          ...marks[selKey],
          customStyles: {
            ...marks[selKey].customStyles,
            container: {
              ...marks[selKey].customStyles.container,
              borderWidth: 2.5,
              borderColor: "#D4A0BC",
              shadowColor: "#D4879E",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            },
            text: {
              ...marks[selKey].customStyles.text,
              fontWeight: "700",
            },
          },
        };
      } else {
        marks[selKey] = {
          customStyles: {
            container: {
              backgroundColor: "#E8B4CB",
              borderRadius: 18,
              shadowColor: "#D4879E",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            },
            text: {
              color: "#FFFFFF",
              fontWeight: "700",
            },
          },
        };
      }
    }

    return marks;
  }, [lastPeriodDate, cycleLength, periodDuration, selectedDate]);

  // ── Handle day press
  const handleDayPress = (day) => {
    const date = new Date(day.year, day.month - 1, day.day);
    onSelectDate(date);
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType="custom"
        markedDates={markedDates}
        onDayPress={handleDayPress}
        enableSwipeMonths
        hideExtraDays
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
          textSectionTitleColor: "#9A8A92",
          selectedDayBackgroundColor: "#E8B4CB",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#D4A0BC",
          dayTextColor: "#5B4B54",
          textDisabledColor: "#C8BCC2",
          monthTextColor: "#5B4B54",
          arrowColor: "#8B6C80",
          textDayFontFamily: "Poppins_400Regular",
          textMonthFontFamily: "Poppins_600SemiBold",
          textDayHeaderFontFamily: "Poppins_500Medium",
          textDayFontSize: 14,
          textMonthFontSize: 17,
          textDayHeaderFontSize: 12,
        }}
        style={styles.calendar}
      />

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#F8D7DA" }]} />
          <Text style={styles.legendText}>Period</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#E6D8F5" }]} />
          <Text style={styles.legendText}>Ovulation</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#EFE3FF" }]} />
          <Text style={styles.legendText}>Fertile</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#F5F1EB" }]} />
          <Text style={styles.legendText}>Normal</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: 28,
    padding: 12,
    paddingBottom: 4,
    shadowColor: "#B8A0B0",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
    overflow: "hidden",
  },
  calendar: {
    borderRadius: 20,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(200, 180, 190, 0.12)",
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#9A8A92",
  },
});
