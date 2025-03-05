import { View, Text, StyleSheet } from "react-native";

export default function SettingsTab() {
  return (
    <View style={styles.container}>
      <Text>Settings will go here</Text>
      <Text>File is currently in src app (tabs) settings.tsx</Text>
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
