import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LogoLightSmall from "@/assets/svg/logo-light-sm";
import { spectrum } from "@/theme";

function WalletDisplay() {
  const { me } = {
    me: {
      otc_redeemed: true,
      token_balance: {
        token_balance_get: 3,
      },
    },
  };
  return (
    (me?.otc_redeemed && (
      <Link href="/(tabs)/wallet" asChild>
        <Pressable>
          <View style={styles.view}>
            <Text style={styles.text5}>
              USD{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(me.token_balance.token_balance_get * 0.1)}
            </Text>
            <Text style={styles.text3}>
              GET{" "}
              {new Intl.NumberFormat().format(
                me.token_balance.token_balance_get,
              )}
            </Text>
          </View>
        </Pressable>
      </Link>
    )) ||
    null
  );
}

function LogoDisplay() {
  return (
    <Link href="/(tabs)/dashboard" asChild>
      <Pressable>
        <LogoLightSmall />
      </Pressable>
    </Link>
  );
}

function SettingsDisplay() {
  return (
    <Link href="/(tabs)/settings" asChild>
      <Pressable>
        <Ionicons
          name="menu-outline"
          size={36}
          color={spectrum.primaryContent}
        />
      </Pressable>
    </Link>
  );
}

export default function CustomHeader() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[spectrum.primary, spectrum.secondary]}
      locations={[0.2, 1]}
      style={{
        height: insets.top + 75,
        paddingHorizontal: 16,
        paddingTop: insets.top,
      }}
    >
      <View style={styles.container}>
        <LogoDisplay />
        <WalletDisplay />
        <SettingsDisplay />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  view: {
    alignItems: "center",
  },
  text5: {
    fontSize: 17,
    color: spectrum.primaryContent,
  },
  text3: {
    fontSize: 13,
    color: spectrum.primaryContent,
  },
});
