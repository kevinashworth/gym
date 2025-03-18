// import { useStoreActions } from 'easy-peasy';
import * as Application from "expo-application";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  // SafeAreaView,
  // SafeAreaProvider,
  // SafeAreaInsetsContext,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import LogoLight from "@/assets/svg/logo-light";
import Welcome from "@/assets/svg/welcome";
import Button from "@/components//button";
import { spectrum } from "@/theme";

const window = Dimensions.get("window");
const { height, width } = window;

export default function WelcomeMain() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // const { resetSignUp } = useStoreActions((state) => state.auth);

  const handleRedirectTermsAndConditionsPage = () =>
    Linking.openURL("https://www.gotyou.co/terms-and-conditions");
  const handleRedirectPrivacyPolicyPage = () =>
    Linking.openURL("https://www.gotyou.co/privacy-policy");

  useFocusEffect(() => {
    // resetSignUp();
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <View style={styles.container}>
        <Stack.Screen
          // name="welcome"
          options={{
            headerShown: false,
          }}
        />
        <LinearGradient
          colors={[spectrum.primary, spectrum.secondary]}
          locations={[0.2, 1]}
          style={styles.backgroundGradient}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
            }}
          >
            <LogoLight />
            <Welcome />
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <Button
                buttonStyle={{ width: buttonWidth }}
                label="Sign In"
                onPress={() => router.push("/entry/sign-in")}
                size="lg"
                variant="primary"
              />
              <Button
                buttonStyle={{ width: buttonWidth }}
                label="Get Started"
                onPress={() => router.push("/")}
                size="lg"
                variant="default"
              />
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: insets.bottom + 10,
              paddingLeft: "10%",
              paddingRight: "10%",
            }}
          >
            <Text style={styles.disclaimer}>
              By using this service you agree to the GotYou{" "}
              <Pressable onPress={handleRedirectTermsAndConditionsPage}>
                <Text style={styles.blueLinkText}>Terms and Conditions</Text>
              </Pressable>{" "}
              and{" "}
              <TouchableOpacity onPress={handleRedirectPrivacyPolicyPage}>
                <Text style={styles.blueLinkText}>Privacy Policy</Text>
              </TouchableOpacity>
              .
            </Text>
            <Text style={styles.version}>
              Version {Application.nativeApplicationVersion}
            </Text>
            <Text style={styles.version}>
              ©2025 GotYou, Inc. All rights reserved.
            </Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  backgroundGradient: {
    height,
    width,
  },
  disclaimer: {
    color: spectrum.base1Content,
    fontSize: 14,
    fontWeight: 200,
    lineHeight: 21,
    textAlign: "center",
  },
  blueLinkText: {
    color: spectrum.blue10,
    fontSize: 14,
    textDecorationLine: "underline",
    transform: [{ translateY: 5 }], // to overcome TouchableOpacity weirdness
  },
  version: {
    color: spectrum.base2Content,
    fontSize: 12,
    fontWeight: 200,
    lineHeight: 18,
    textAlign: "center",
  },
});
