import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

import { spectrum } from "@/theme";

export default function NotificationsTab() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: spectrum.primary },
          headerTintColor: spectrum.primaryContent,
        }}
      />
      <Text>Notifications will go here</Text>
      <Text>File is currently in src app (tabs) notifications.tsx</Text>
      <Text>The title should have a blue background</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
