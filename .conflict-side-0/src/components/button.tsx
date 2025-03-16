import React from "react";

import {
  // Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { spectrum } from "@/theme";

import Icon from "./icon";

import type { IconName } from "./icon";
interface Props {
  icon?: React.ReactElement;
  iconName?: IconName;
  label?: string;
  onPress: () => void;
}

export default function Button({ icon, iconName, label, onPress }: Props) {
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
