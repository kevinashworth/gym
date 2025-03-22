import { router, Stack } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import Icon, { IconName } from "@/components/icon";
import { useAuthStore, useUserStore } from "@/store";
import { spectrum } from "@/theme";

type SettingItemProps = {
  icon?: IconName;
  iconColor?: string;
  label: string;
  onPress: () => void;
  textColor?: string;
  isLast?: boolean;
};

const SettingItem = ({
  icon,
  iconColor,
  label,
  onPress,
  textColor,
  isLast,
}: SettingItemProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.settingItem,
      !isLast && styles.settingItemBorder,
      pressed && styles.settingItemPressed,
    ]}
  >
    <View style={styles.settingContent}>
      {icon ? (
        <Icon
          name={icon}
          size={20}
          color={iconColor || textColor || spectrum.base1Content}
        />
      ) : (
        <View style={{ width: 20 }} />
      )}
      <Text style={[styles.settingLabel, textColor && { color: textColor }]}>
        {label}
      </Text>
    </View>
    <Icon name="chevron-right" size={16} color={spectrum.base1Content} />
  </Pressable>
);

export default function SettingsTab() {
  const clearCognitoUser = useAuthStore((s) => s.clearCognitoUser);
  const clearUser = useUserStore((s) => s.clearUser);

  const handleLogout = () =>
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          clearCognitoUser();
          clearUser();
          if (router.canDismiss()) {
            router.dismissAll();
          }
          router.replace("/welcome");
        },
      },
    ]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Settings" }} />
      <View style={styles.section}>
        <SettingItem
          icon="circle-user-round"
          iconColor={spectrum.primary}
          label="Edit Profile"
          onPress={() => console.log("Edit Profile")}
        />
        <SettingItem
          icon="notifications"
          iconColor={spectrum.primary}
          label="Notifications"
          onPress={() => console.log("Notifications")}
        />
        <SettingItem
          icon="users-round"
          iconColor={spectrum.primary}
          label="Invite Friends"
          onPress={() => console.log("Invite")}
        />
        <SettingItem
          icon="circle-help"
          iconColor={spectrum.primary}
          label="Help"
          onPress={() => console.log("Help")}
        />
        <SettingItem
          label="Logout"
          onPress={handleLogout}
          textColor={spectrum.error}
          isLast
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: spectrum.base1[100],
  },
  section: {
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: spectrum.base1,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "white",
  },
  settingItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: spectrum.base3Content,
  },
  settingItemPressed: {
    backgroundColor: spectrum.base1,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: spectrum.black,
  },
});
