import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import BottomGet from "@/assets/svgs/bottom-get";
import { spectrum } from "@/theme";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: spectrum.primary }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
          tabBarLabelStyle: {
            letterSpacing: -0.15,
          },
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="wallet" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          title: "Action",
          tabBarIcon: () => <BottomGet size={48} style={{ marginTop: -20 }} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="notifications" color={color} />
          ),
          tabBarLabelStyle: {
            letterSpacing: -0.85,
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="search" color={color} />
          ),
          // tabBarLabelStyle: {
          //   fontSize: 9,
          // },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
