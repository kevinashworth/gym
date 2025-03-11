import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

import { spectrum } from "@/theme";

export default function WalletTab() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: spectrum.primary },
          headerTintColor: spectrum.primaryContent,
        }}
      />
      <Text>Wallet will go here</Text>
      <Text style={styles.pageInfo}>
        src/app/(tabs)/wallet.tsx{"\n"}
        The title should be visible and have a "primary" background
      </Text>
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
