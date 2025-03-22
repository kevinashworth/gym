import { Stack, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "@/components//button";
import DisplayJSON from "@/components/display-json";
import NotificationItem from "@/components/notification-item";
import { useDevStore, useTestStore } from "@/store";
import { spectrum } from "@/theme";

export default function NotificationsTab() {
  const enableDevToolbox = useDevStore((s) => s.enableDevToolbox);
  const { count, message, setCount, setMessage, reset } = useTestStore();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.main}>
          <NotificationItem
            title="Coming Soon"
            subtitle={`This feature is progress.\nCheck back soon for more updates`}
          />
          <NotificationItem
            title="Coming Soon, We Promise"
            subtitle="Notifications are stiiiillllll in progress."
            color={spectrum.warning}
          />
          <Text style={styles.pageInfo}>src/app/(tabs)/notifications.tsx</Text>
        </View>
        {enableDevToolbox && (
          <View
            style={{
              alignItems: "center",
              borderColor: spectrum.black,
              borderRadius: 8,
              borderWidth: StyleSheet.hairlineWidth,
              gap: 8,
              justifyContent: "center",
              margin: 16,
              paddingHorizontal: 8,
              paddingTop: 2,
              paddingBottom: 8,
            }}
          >
            <Text
              style={{
                color: spectrum.black,
                fontSize: 12,
                fontWeight: 400,
                lineHeight: 21,
                textAlign: "center",
              }}
            >
              Dev Toolbox
            </Text>
            <Button
              label="Welcome Screen"
              onPress={() => router.push("/welcome")}
              size="md"
              variant="black"
            />
            <Button
              label="Sign In Screen"
              onPress={() => router.push("/entry/sign-in")}
              size="md"
              variant="black"
            />
            <DisplayJSON json={{ count, message }} />
            <Button
              label="Reset"
              onPress={() => reset()}
              size="md"
              variant="black"
            />
            <Button
              label="Set Count"
              onPress={() => setCount(10)}
              size="md"
              variant="black"
            />
            <Button
              label="Set Message"
              onPress={() => setMessage("Hello from testing store 3")}
              size="md"
              variant="black"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    alignItems: "center",
    flex: 1,
    gap: 6,
    justifyContent: "center",
    padding: 8,
  },
  text: {
    fontSize: 29,
    padding: 12,
  },
  pageInfo: {
    borderTopColor: spectrum.base3Content,
    borderTopWidth: 1,
    color: spectrum.base1Content,
    fontSize: 11,
    fontWeight: 300,
    marginVertical: 12,
    paddingVertical: 12,
    textAlign: "center",
  },
});
