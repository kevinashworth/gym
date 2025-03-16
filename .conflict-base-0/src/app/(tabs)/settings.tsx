import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

import { spectrum } from "@/theme";

export default function SettingsTab() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text>Settings will go here</Text>
      <Text style={styles.pageInfo}>src/app/(tabs)/settings.tsx</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageInfo: {
    borderTopColor: spectrum.base3Content,
    borderTopWidth: 1,
    color: spectrum.base1Content,
    fontSize: 11,
    fontWeight: 300,
    marginVertical: 12,
    paddingVertical: 12,
    textAlign: "center",
  },
});
