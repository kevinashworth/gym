import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import NotificationItem from "@/components/notification-item";
import { spectrum } from "@/theme";

export default function NotificationsTab() {
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
