import { Redirect, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { spectrum } from "@/theme";

export default function StartPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: spectrum.primary }]}>
        <Redirect href="/welcome" />
      </View>
    </>
  );
}
