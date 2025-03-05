import { View, Text, StyleSheet } from "react-native";

export default function SearchTab() {
  return (
    <View style={styles.container}>
      <Text>Search will go here</Text>
      <Text>File is currently in src app (tabs) search.tsx</Text>
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
