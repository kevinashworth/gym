import React from "react";

import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { spectrum } from "@/theme";

import Icon from "./icon";

import type { IconName } from "./icon";

type Sizes = "sm" | "md" | "lg" | "xl";
type Variants =
  | "primary"
  | "secondary"
  | "outline"
  | "black"
  | "white"
  | "default";

type ButtonSizesContainer = Record<Sizes, ViewStyle>;
type ButtonSizesLabel = Record<Sizes, TextStyle>;
type ButtonVariantsContainer = Record<Variants, ViewStyle>;
type ButtonVariantsLabel = Record<Variants, TextStyle>;

const buttonSizesContainer: ButtonSizesContainer = {
  sm: { borderRadius: 12, padding: 4, paddingHorizontal: 8 },
  md: { borderRadius: 12, padding: 6, paddingHorizontal: 12 },
  lg: { borderRadius: 16, padding: 8, paddingHorizontal: 16 },
  xl: { borderRadius: 20, padding: 10, paddingHorizontal: 20 },
};

const buttonVariantsContainer: ButtonVariantsContainer = {
  primary: {
    backgroundColor: spectrum.primary,
    borderColor: spectrum.primary,
    borderWidth: 1,
  },
  secondary: {
    backgroundColor: spectrum.secondary,
    borderColor: spectrum.secondary,
    borderWidth: 1,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: spectrum.gray1,
    borderWidth: 1,
  },
  black: {
    backgroundColor: spectrum.black,
    borderColor: spectrum.black,
    borderWidth: 1,
  },
  white: {
    backgroundColor: spectrum.white,
    borderColor: spectrum.white,
    borderWidth: 1,
  },
  default: {
    backgroundColor: spectrum.base1,
    borderColor: spectrum.base1,
    borderWidth: 1,
  },
};

const buttonSizesLabel: ButtonSizesLabel = {
  sm: { fontSize: 12, fontWeight: 400 },
  md: { fontSize: 14, fontWeight: 500 },
  lg: { fontSize: 16, fontWeight: 500 },
  xl: { fontSize: 18, fontWeight: 500 },
};

const buttonVariantsLabel: ButtonVariantsLabel = {
  primary: { color: spectrum.white },
  secondary: { color: spectrum.gray1 },
  outline: { color: spectrum.gray1 },
  black: { color: spectrum.white },
  white: { color: spectrum.black },
  default: { color: spectrum.primary },
};

interface ButtonProps {
  buttonStyle?: ViewStyle;
  disabled?: boolean;
  icon?: React.ReactElement;
  iconName?: IconName;
  label?: string;
  onPress: () => void;
  size?: Sizes;
  variant?: Variants;
  withoutShadow?: boolean;
}

export default function Button({
  buttonStyle,
  disabled = false,
  icon,
  iconName,
  label,
  onPress,
  size = "md",
  variant = "primary",
  withoutShadow = false,
}: ButtonProps) {
  const IconComponent = icon ? (
    React.cloneElement(icon, { color: spectrum.gray1 })
  ) : iconName ? (
    <Icon name={iconName} size={14} color={spectrum.gray1} />
  ) : null;

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.button}
      >
        {IconComponent}
        {label && <Text style={styles.buttonLabel}>{label}</Text>}
      </TouchableOpacity>
    </View>
  );

  // return (
  //   <View style={styles.buttonContainer}>
  //     <Pressable style={styles.button} onPress={onPress}>
  //       {Icon}
  //       <Text style={styles.buttonLabel}>{label}</Text>
  //     </Pressable>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  buttonContainer: {},
  button: {
    alignItems: "center",
    backgroundColor: spectrum.primary,
    borderRadius: 12,
    elevation: 8,
    flexDirection: "row",
    gap: 8,
    padding: 6,
    paddingHorizontal: 12,
  },
  buttonLabel: {
    alignSelf: "center",
    color: spectrum.gray1,
    fontSize: 14,
    fontWeight: 700,
  },
});
