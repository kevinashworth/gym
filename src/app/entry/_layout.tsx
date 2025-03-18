import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function EntryLayout() {
  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
