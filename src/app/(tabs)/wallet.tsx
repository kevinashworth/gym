import { View, Text, StyleSheet } from "react-native";

export default function WalletTab() {
  return (
    <View style={styles.container}>
      <Text>Wallet</Text>
      <Text>File is currently in src app (tabs) wallet.tsx</Text>
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
