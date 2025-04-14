import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import BottomGet from "@/assets/svg/bottom-get";
import { spectrum } from "@/theme";

type TabBarIconProps = {
  color: string;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: spectrum.primary,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarAccessibilityLabel: "Dashboard",
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarAccessibilityLabel: "Wallet",
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <Ionicons size={28} name="wallet" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          title: "Action",
          tabBarAccessibilityLabel: "Action",
          tabBarIcon: () => <BottomGet size={60} />,
          tabBarIconStyle: {
            marginTop: -16,
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarAccessibilityLabel: "Notifications",
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <Ionicons size={28} name="notifications" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarAccessibilityLabel: "Search",
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <Ionicons size={28} name="search" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
