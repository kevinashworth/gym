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
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { AppState, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CustomHeader from "@/components/header";
import EntryHeader from "@/components/header-entry";
import { SessionProvider } from "@/context/auth";

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

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay to simulate slow loading.
        // TODO: Remove this!
        await new Promise((resolve) => setTimeout(resolve, 1500));
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

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <StatusBar style="light" />
          <Stack>
            <Stack.Screen
              name="(tabs)"
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
        </SessionProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
