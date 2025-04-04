import * as Application from "expo-application";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import TextLink from "react-native-text-link";

import LogoLight from "@/assets/svg/logo-light";
import Welcome from "@/assets/svg/welcome";
import Button from "@/components//button";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";

const window = Dimensions.get("window");
const { height, width } = window;

const buttonWidth = 224;

function WelcomeScreen() {
  const showDevToolbox = useDevStore((s) => s.showDevToolbox);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleRedirectTermsAndConditionsPage = () =>
    Linking.openURL("https://www.gotyou.co/terms-and-conditions");
  const handleRedirectPrivacyPolicyPage = () =>
    Linking.openURL("https://www.gotyou.co/privacy-policy");

  useFocusEffect(() => {
    // resetSignUp();
  });

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <View style={[styles.container, StyleSheet.absoluteFillObject]}>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient
          colors={[spectrum.primary, spectrum.secondary]}
          locations={[0.2, 1]}
          style={styles.backgroundGradient}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
            }}>
            <LogoLight />
            <Welcome />
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}>
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
                onPress={() => router.push("/entry/sign-up")}
                size="lg"
                variant="default"
              />
              {showDevToolbox && (
                <View
                  style={{
                    alignItems: "center",
                    borderColor: spectrum.black,
                    borderWidth: StyleSheet.hairlineWidth,
                    gap: 2,
                    justifyContent: "center",
                    margin: 16,
                    paddingHorizontal: 8,
                    paddingTop: 2,
                    paddingBottom: 8,
                  }}>
                  <Text
                    style={{
                      color: spectrum.black,
                      fontSize: 12,
                      fontWeight: 400,
                      lineHeight: 21,
                      paddingBottom: 8,
                      textAlign: "center",
                    }}>
                    Dev Toolbox
                  </Text>
                  <Button
                    buttonStyle={{ width: buttonWidth / 2 }}
                    label="Dashboard"
                    onPress={() => router.push("/(tabs)")}
                    size="sm"
                    variant="black"
                  />
                  <Button
                    buttonStyle={{ width: buttonWidth / 2 }}
                    label="Collect Account"
                    onPress={() => router.push("/entry/sign-up/collect-account")}
                    size="sm"
                    variant="black"
                  />
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              marginBottom: insets.bottom + Platform.OS === "ios" ? 10 : 40,
              paddingLeft: "10%",
              paddingRight: "10%",
            }}>
            <Text style={styles.disclaimer}>By using this service you agree to the GotYou</Text>
            <TextLink
              links={[
                {
                  text: "Terms and Conditions",
                  onPress: handleRedirectTermsAndConditionsPage,
                },
                {
                  text: "Privacy Policy",
                  onPress: handleRedirectPrivacyPolicyPage,
                },
              ]}
              textStyle={styles.disclaimer}
              textLinkStyle={styles.blueLinkText}>
              Terms and Conditions and Privacy Policy.
            </TextLink>
            <Text style={styles.version}>Version {Application.nativeApplicationVersion}</Text>
            <Text style={styles.version}>©2025 GotYou, Inc. All rights reserved.</Text>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
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
    color: spectrum.primary,
    textDecorationLine: "underline",
  },
  version: {
    color: spectrum.base1Content,
    fontSize: 12,
    fontWeight: 200,
    lineHeight: 18,
    textAlign: "center",
  },
});

export default WelcomeScreen;
