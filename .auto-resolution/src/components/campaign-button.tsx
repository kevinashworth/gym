import React from "react";

import { StyleSheet, View, Pressable, Text } from "react-native";

import { spectrum } from "@/theme";

interface Props {
  icon: React.ReactElement;
  label: string;
  onPress?: () => void;
}

export default function Button({ icon, label, onPress }: Props) {
  const Icon = icon
    ? React.cloneElement(icon, { color: spectrum.primary })
    : null;

  const onPressFn = !!onPress
    ? onPress
    : () => alert(`You pressed the ${label} button.`);

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPressFn}>
        {Icon}
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    backgroundColor: spectrum.base1,
    borderWidth: 1,
    borderColor: spectrum.primary,
    borderRadius: 18,
    justifyContent: "center",
    padding: 3,
    width: 128,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  buttonLabel: {
    color: spectrum.primary,
    fontSize: 14,
    fontWeight: 500,
  },
});
