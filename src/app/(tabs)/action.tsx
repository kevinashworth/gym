import { View, Text, StyleSheet } from "react-native";

export default function ActionTab() {
  return (
    <View style={styles.container}>
      <Text>Action will go here</Text>
      <Text>File is currently in src app (tabs) action.tsx</Text>
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
