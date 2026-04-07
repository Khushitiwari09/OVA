import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function PhaseHelperCard({ phaseInfo }) {
  if (!phaseInfo) return null;

  const {
    name,
    icon,
    color,
    bgColor,
    description,
    body,
    tips,
    dayInCycle,
    cycleLength,
  } = phaseInfo;

  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      {/* Phase header */}
      <View style={styles.header}>
        <View style={[styles.iconBubble, { backgroundColor: color }]}>  
          <MaterialIcons name={icon} size={18} color="#FFFFFF" />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.phaseName, { color }]}>{name}</Text>
          <Text style={styles.dayLabel}>
            Day {dayInCycle} of {cycleLength}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Body condition */}
      <View style={styles.conditionSection}>
        <Text style={styles.sectionLabel}>How your body may feel</Text>
        <View style={styles.conditionRow}>
          <MaterialIcons name="bolt" size={15} color="#9A8A92" />
          <Text style={styles.conditionText}>
            <Text style={styles.conditionKey}>Energy: </Text>
            {body.energy}
          </Text>
        </View>
        <View style={styles.conditionRow}>
          <MaterialIcons name="psychology" size={15} color="#9A8A92" />
          <Text style={styles.conditionText}>
            <Text style={styles.conditionKey}>Mood: </Text>
            {body.mood}
          </Text>
        </View>
        <View style={styles.conditionRow}>
          <MaterialIcons name="face" size={15} color="#9A8A92" />
          <Text style={styles.conditionText}>
            <Text style={styles.conditionKey}>Skin: </Text>
            {body.skin}
          </Text>
        </View>
      </View>

      {/* Care tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionLabel}>Gentle care suggestions</Text>
        {tips.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <View style={[styles.tipBullet, { backgroundColor: color }]} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: 22,
    shadowColor: "#B8A0B0",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  phaseName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
  },
  dayLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#9A8A92",
    marginTop: 1,
  },

  // Description
  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "#5B4B54",
    marginBottom: 18,
  },

  // Body condition
  conditionSection: {
    marginBottom: 18,
    gap: 8,
  },
  sectionLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#6D5C65",
    marginBottom: 4,
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingLeft: 2,
  },
  conditionText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#6D5C65",
  },
  conditionKey: {
    fontFamily: "Poppins_500Medium",
    color: "#5B4B54",
  },

  // Tips
  tipsSection: {
    gap: 8,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingLeft: 2,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#6D5C65",
  },
});
