import { View, Text, StyleSheet } from "react-native";

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text>verify account</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyComponent;
