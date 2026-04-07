import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { OptionChip } from "./OptionChip";

export function QuestionCard({
  question,
  subtitle,
  options,
  selectedValues = [],
  onSelect,
  color = "#E8B4CB",
  multiSelect = true,
}) {
  const handleSelect = (option) => {
    if (multiSelect) {
      if (selectedValues.includes(option)) {
        onSelect(selectedValues.filter((v) => v !== option));
      } else {
        onSelect([...selectedValues, option]);
      }
    } else {
      onSelect([option]);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.optionsWrap}>
        {options.map((option) => (
          <OptionChip
            key={option}
            label={option}
            selected={selectedValues.includes(option)}
            onPress={() => handleSelect(option)}
            color={color}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    shadowColor: "#B8A0B0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  question: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#5B4B54",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#9A8A92",
    marginBottom: 16,
    lineHeight: 20,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
});
