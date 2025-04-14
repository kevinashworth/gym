import { router, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

import alert from "@/components/alert";
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

const SettingItem = ({ icon, iconColor, label, onPress, textColor, isLast }: SettingItemProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.settingItem,
      !isLast && styles.settingItemBorder,
      pressed && styles.settingItemPressed,
    ]}>
    <View style={styles.settingContent}>
      {icon ? (
        <Icon name={icon} size={20} color={iconColor || textColor || spectrum.base1Content} />
      ) : (
        <View style={{ width: 20 }} />
      )}
      <Text style={[styles.settingLabel, textColor && { color: textColor }]}>{label}</Text>
    </View>
    <Icon name="chevron-right" size={16} color={spectrum.base1Content} />
  </Pressable>
);

export default function SettingsTab() {
  const resetAuth = useAuthStore((s) => s.resetAuth);
  const resetUser = useUserStore((s) => s.resetUser);

  const handleLogout = () =>
    alert("Logout", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => console.log("Alert: Cancel"),
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          resetAuth();
          resetUser();
          if (router.canDismiss()) {
            router.dismissAll();
          }
          router.replace("/");
        },
      },
    ]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Settings",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: -16,
              }}>
              <Icon name="chevron-left" size={32} color={spectrum.blue10} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.section}>
        <SettingItem
          icon="circle-user-round"
          iconColor={spectrum.primary}
          label="Profile"
          onPress={() => router.push("/settings/profile")}
        />
        <SettingItem
          icon="notifications"
          iconColor={spectrum.primary}
          label="Notifications"
          onPress={() =>
            Toast.show({
              position: "bottom",
              type: "primary",
              text1: "Notification Settings",
              text2: "This feature is not yet implemented",
            })
          }
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
          onPress={() => router.push("/settings/help")}
        />
        <SettingItem label="Logout" onPress={handleLogout} textColor={spectrum.error} isLast />
      </View>
      {process.env.NODE_ENV === "development" && (
        <View style={styles.devSettings}>
          <SettingItem
            icon="wrench"
            label="Dev"
            onPress={() => router.push("/settings/dev")}
            textColor={spectrum.success}
            isLast
          />
        </View>
      )}
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
    borderColor: spectrum.base3Content,
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
    backgroundColor: spectrum.gray6,
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
  backText: {
    color: spectrum.blue10,
    fontSize: 18,
    textAlign: "center",
  },
  devSettings: {
    marginTop: 16,
    paddingTop: 16,
  },
});
