import { useEffect, useState } from "react";

import { useReactQueryDevTools } from "@dev-plugins/react-query";
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Amplify } from "aws-amplify";
import * as Network from "expo-network";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AppState, Platform } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import CustomHeader from "@/components/header";
import EntryHeader from "@/components/header-entry";
import { SessionProvider } from "@/context/auth";
import { GeoLocationProvider } from "@/context/location";
import { toastConfig } from "@/utils/toast";

import type { AppStateStatus } from "react-native";

// Keep the splash screen visible while we prepare
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// see https://tanstack.com/query/latest/docs/framework/react/react-native#online-status-management
onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return eventSubscription.remove;
});

Amplify.configure({
  Auth: {
    region: "us-west-2",
    userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL,
    userPoolWebClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID,
  },
});

export default function RootLayout() {
  const pathname = usePathname();
  const [appIsReady, setAppIsReady] = useState(false);

  // see https://tanstack.com/query/latest/docs/framework/react/react-native#refetch-on-app-focus
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  useReactQueryDevTools(queryClient);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay to simulate slow loading.
        // TODO: Remove this!
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && Platform.OS === "web") {
      document.title = `GYM ${pathname}`;
    }
  }, [pathname]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <GeoLocationProvider>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  header: () => <CustomHeader />,
                }}
              />
              <Stack.Screen
                name="settings"
                options={{
                  header: () => <CustomHeader />,
                }}
              />
              <Stack.Screen
                name="entry"
                options={{
                  header: () => <EntryHeader />,
                }}
              />
              <Stack.Screen name="welcome" />
            </Stack>
          </GeoLocationProvider>
        </SessionProvider>
      </QueryClientProvider>
      <Toast config={toastConfig} topOffset={insets.top} />
    </SafeAreaProvider>
  );
}
