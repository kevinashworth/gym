import { View, Text, StyleSheet } from "react-native";

export default function ActionTab() {
  return (
    <View style={styles.container}>
      <Text>Action</Text>
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
