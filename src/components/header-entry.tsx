import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, usePathname, useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LogoLightSmall, { logoWidth } from "@/assets/svg/logo-light-sm";
import { spectrum } from "@/theme";

// getPageTitle example: '/main/entry/recovery/apply' => 'Retrieve Password'
const getPageTitle = (pathname: string) => {
  const entryPath = pathname.split("/entry/")[1];
  if (!entryPath) return "Welcome";

  const pathParts = entryPath.split("/");
  const entryPart = pathParts[0];

  switch (entryPart) {
    case "recovery":
      return "Retrieve Password";
    case "sign-in":
      return "Sign In";
    case "sign-up":
      return "Sign Up";
    default:
      return "Welcome";
  }
};

function PageTitleDisplay({ pathname }: { pathname: string }) {
  return <Text style={styles.pageTitle}>{getPageTitle(pathname)}</Text>;
}

function LogoDisplay() {
  return (
    <Link href="/(tabs)" asChild>
      <Pressable>
        <LogoLightSmall />
      </Pressable>
    </Link>
  );
}

function BackDisplay({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-end",
          opacity: disabled ? 0.5 : 1,
          width: logoWidth,
        }}
      >
        <Ionicons name="chevron-back" size={20} color="white" />
        <Text style={styles.backText}>Back</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function EntryHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const signUpLoading = false;

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/(tabs)");
    }
  };

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
        <PageTitleDisplay pathname={pathname} />
        <BackDisplay onPress={handleGoBack} disabled={signUpLoading} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pageTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: 500,
  },
  backText: {
    color: "white",
    fontSize: 18,
    fontWeight: 400,
  },
});
