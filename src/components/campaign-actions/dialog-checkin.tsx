import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import ErrorMessage from "@/components/error-message";
import { spectrum } from "@/theme";

import type { Location } from "@/types/location";

// TODO: Maybe this will serve for OutCheckIn, too ?
// Just a modal that shows a spinner and an error message.

interface CheckInDialogContentsProps {
  error: Error | null;
  isError: boolean;
  isMutating: boolean;
  location: Location;
  onSubmit: () => void;
}

function CheckInDialogContents({
  error,
  isError,
  isMutating,
  location,
  onSubmit,
}: CheckInDialogContentsProps) {
  return (
    <View style={styles.container}>
      {isMutating && (
        <>
          <Text style={styles.text}>Checking In...</Text>
          <ActivityIndicator size="large" color={spectrum.primary} />
        </>
      )}
      {isError && (
        <>
          <Text style={styles.text}>Something Went Wrong</Text>
          <ErrorMessage error={error} size="large" style={{ paddingVertical: 8 }} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    // backgroundColor: "orange",
    gap: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  text: {
    color: spectrum.primary,
    fontSize: 16,
    fontWeight: 300,
  },
});

export default CheckInDialogContents;
