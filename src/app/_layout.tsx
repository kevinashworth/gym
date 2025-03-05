import { Stack } from "expo-router";

import CustomHeader from "@/components/header";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          header: () => <CustomHeader />,
        }}
      />
    </Stack>
  );
}
