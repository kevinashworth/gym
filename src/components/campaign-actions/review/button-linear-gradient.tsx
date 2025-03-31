import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { spectrum } from "@/theme";

type Sizes = "sm" | "md" | "lg" | "xl";

type ButtonSizesContainer = Record<Sizes, ViewStyle>;
type ButtonSizesLabel = Record<Sizes, TextStyle>;

const buttonSizesContainer: ButtonSizesContainer = {
  sm: { borderRadius: 12, padding: 4, paddingHorizontal: 12 },
  md: { borderRadius: 12, padding: 6, paddingHorizontal: 16 },
  lg: { borderRadius: 16, padding: 8, paddingHorizontal: 20 },
  xl: { borderRadius: 20, padding: 10, paddingHorizontal: 24 },
};

const buttonSizesLabel: ButtonSizesLabel = {
  sm: { fontSize: 12 },
  md: { fontSize: 14 },
  lg: { fontSize: 16 },
  xl: { fontSize: 18 },
};

interface ButtonProps {
  buttonStyle?: ViewStyle;
  disabled?: boolean;
  end: number;
  label: string;
  onPress: () => void;
  size?: Sizes;
}

export default function Button({
  buttonStyle,
  disabled = false,
  end = 1,
  label,
  onPress,
  size = "md",
}: ButtonProps) {
  const colorsEnabled: [string, string, ...string[]] = [spectrum.primary, spectrum.secondary];
  const colorsDisabled: [string, string, ...string[]] = [spectrum.gray9, spectrum.gray4];

  return (
    <LinearGradient
      colors={disabled ? colorsDisabled : colorsEnabled}
      start={{ x: end - 0.5, y: 0 }}
      end={{ x: end + 0.5, y: 0 }}
      style={{ borderRadius: buttonSizesContainer[size].borderRadius }}>
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={disabled}
          onPress={!disabled ? onPress : undefined}
          style={[styles.buttonContainer, buttonStyle, buttonSizesContainer[size]]}>
          <Text style={[styles.buttonLabel, buttonSizesLabel[size]]}>{label}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    borderRadius: 12,
    elevation: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  buttonLabel: {
    alignSelf: "center",
    color: spectrum.white,
    fontWeight: 500,
  },
});
