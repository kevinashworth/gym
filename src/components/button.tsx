import React from "react";

import {
  ActivityIndicator,
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
export type Variants =
  | "primary"
  | "secondary"
  | "outline"
  | "error"
  | "black"
  | "white"
  | "default";

type ActivityIndicatorProps = {
  color?: string;
  size?: "small" | "large";
  style?: ViewStyle;
};

type ButtonSizesContainer = Record<Sizes, ViewStyle>;
type ButtonSizesLabel = Record<Sizes, TextStyle>;
type ButtonVariantsContainer = Record<Variants, ViewStyle>;
type ButtonVariantsLabel = Record<Variants, TextStyle>;
type ButtonVariantsTextColor = Record<Variants, string>;

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
  },
  outline: {
    backgroundColor: spectrum.white,
    borderColor: spectrum.primary,
    borderWidth: 1,
  },
  error: {
    backgroundColor: spectrum.error,
  },
  black: {
    backgroundColor: spectrum.black,
  },
  white: {
    backgroundColor: spectrum.white,
  },
  default: {
    backgroundColor: spectrum.base1,
  },
};

const defaultDisabledContainer = {
  backgroundColor: spectrum.gray10,
  borderColor: spectrum.gray10,
};
const buttonDisabledVariantsContainer: ButtonVariantsContainer = {
  primary: defaultDisabledContainer,
  secondary: defaultDisabledContainer,
  outline: {
    backgroundColor: spectrum.white,
    borderColor: spectrum.gray10,
    borderWidth: 1,
  },
  error: defaultDisabledContainer,
  black: defaultDisabledContainer,
  white: defaultDisabledContainer,
  default: defaultDisabledContainer,
};

const buttonSizesLabel: ButtonSizesLabel = {
  sm: { fontSize: 12, fontWeight: 500 },
  md: { fontSize: 14, fontWeight: 500 },
  lg: { fontSize: 16, fontWeight: 500 },
  xl: { fontSize: 18, fontWeight: 500 },
};

const buttonVariantsLabel: ButtonVariantsLabel = {
  primary: { color: spectrum.white },
  secondary: { color: spectrum.gray1 },
  outline: { color: spectrum.primary },
  error: { color: spectrum.white },
  black: { color: spectrum.white },
  white: { color: spectrum.black },
  default: { color: spectrum.primary },
};

const defaultDisabledLabel = {
  color: spectrum.gray10,
};

const buttonDisabledVariantsLabel: ButtonVariantsLabel = {
  primary: defaultDisabledLabel,
  secondary: defaultDisabledLabel,
  outline: defaultDisabledLabel,
  error: defaultDisabledLabel,
  black: defaultDisabledLabel,
  white: defaultDisabledLabel,
  default: defaultDisabledLabel,
};

const buttonVariantsTextColor: ButtonVariantsTextColor = Object.fromEntries(
  Object.entries(buttonVariantsLabel).map(([variant, style]) => [variant, style.color])
) as ButtonVariantsTextColor;

interface ButtonProps {
  activityIndicator?: boolean;
  activityIndicatorProps?: ActivityIndicatorProps;
  buttonStyle?: ViewStyle;
  disabled?: boolean;
  icon?: React.ReactElement;
  iconName?: IconName;
  label?: string;
  onPress: () => void;
  size?: Sizes;
  variant?: Variants;
}

export default function Button({
  activityIndicator = false,
  activityIndicatorProps,
  buttonStyle,
  disabled = false,
  icon,
  iconName,
  label,
  onPress,
  size = "md",
  variant = "primary",
}: ButtonProps) {
  const ActivityIndicatorComponent = activityIndicator && (
    <ActivityIndicator
      color={activityIndicatorProps?.color}
      size={activityIndicatorProps?.size}
      style={activityIndicatorProps?.style}
      testID="activity-indicator"
    />
  );
  const IconComponent =
    icon &&
    React.cloneElement(icon, {
      color: buttonVariantsTextColor[variant] || spectrum.gray1,
    });
  const IconNameComponent = iconName && (
    <Icon name={iconName} size={14} color={buttonVariantsTextColor[variant] || spectrum.gray1} />
  );

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={!disabled ? onPress : undefined}
        style={[
          styles.buttonContainer,
          buttonStyle,
          buttonSizesContainer[size],
          buttonVariantsContainer[variant],
          disabled && buttonDisabledVariantsContainer[variant],
        ]}>
        {ActivityIndicatorComponent}
        {IconComponent}
        {IconNameComponent}
        {label && (
          <Text
            style={[
              styles.buttonLabel,
              buttonSizesLabel[size],
              buttonVariantsLabel[variant],
              disabled && buttonDisabledVariantsLabel[variant],
            ]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    backgroundColor: spectrum.primary,
    // borderRadius: 12,
    elevation: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    // padding: 6,
    // paddingHorizontal: 12,
  },
  buttonLabel: {
    alignSelf: "center",
    color: spectrum.gray1,
    // fontSize: 14,
    // fontWeight: 700,
  },
});
