import { useEffect } from "react";

import { useMutation } from "@tanstack/react-query";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import ErrorMessage from "@/components/error-message";
import { useLocation } from "@/context/location";
import api from "@/lib/api";
import { spectrum } from "@/theme";

import type { Campaign } from "@/types/campaign";

// TODO: Maybe this will serve for OutCheckIn, too ?

interface CheckInDialogContentsProps {
  campaign: Campaign;
  onSubmit: () => void;
}

function CheckInDialogContents({ campaign, onSubmit }: CheckInDialogContentsProps) {
  const { lat, lng } = useLocation();

  const { error, isError, isPending, mutate } = useMutation({
    mutationFn: async ({ lat, lng, uuid }: { lat: number; lng: number; uuid: string }) => {
      await api.post(`merchant/action/checkin/${uuid}`, { searchParams: { lat, lng } }); // TODO: add referral to searchParams
    },
    onSuccess: () => onSubmit(),
  });

  // run mutation on mount TODO: attach to a user interaction.
  useEffect(() => {
    if (!lat || !lng) return;
    mutate({ lat, lng, uuid: campaign.uuid });
  }, [mutate, lat, lng, campaign.uuid]);

  return (
    <View style={styles.container}>
      {isPending && (
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
      {!isPending && !isError && <Text style={styles.text}>You have checked in!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
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
