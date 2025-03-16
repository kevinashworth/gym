import React from "react";

import { StyleSheet, View, Pressable, Text } from "react-native";

import { spectrum } from "@/theme";

type Props = {
  icon: React.ReactElement;
  label: string;
  theme?: "campaign";
};

export default function Button({ icon, label, theme }: Props) {
  const Icon = React.cloneElement(icon, { color: spectrum.primary });

  if (theme === "campaign") {
    return (
      <View
        style={[
          styles.buttonContainer,
          {
            backgroundColor: spectrum.base1,
            borderWidth: 1,
            borderColor: spectrum.primary,
            borderRadius: 18,
          },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#fff" }]}
          onPress={() => alert(`You pressed the ${label} button.`)}
        >
          {Icon}
          <Text style={[styles.buttonLabel, { color: spectrum.primary }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={styles.button}
        onPress={() => alert(`You pressed the ${label} button.`)}
      >
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    width: 128,
  },
  button: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 14,
  },
});
