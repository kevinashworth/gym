import { View, Text, StyleSheet } from "react-native";

export default function DashboardTab() {
  return (
    <View style={styles.container}>
      <Text>Dashboard will go here</Text>
      <Text>File is currently in src app (tabs) index.tsx</Text>
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
