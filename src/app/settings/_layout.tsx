import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function SettingsLayout() {
  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="profile/index" />
        <Stack.Screen name="help" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
