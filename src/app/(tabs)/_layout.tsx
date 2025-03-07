import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import BottomGet from "@/assets/svgs/bottom-get";
import { spectrum } from "@/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: spectrum.primary,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarAccessibilityLabel: "Dashboard",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarAccessibilityLabel: "Wallet",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="wallet" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          title: "Action",
          tabBarAccessibilityLabel: "Action",
          tabBarIcon: () => <BottomGet size={48} />,
          tabBarIconStyle: {
            marginTop: -10,
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarAccessibilityLabel: "Notifications",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="notifications" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarAccessibilityLabel: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
