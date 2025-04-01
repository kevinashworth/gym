import { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import Button from "@/components/button";
import ErrorMessage from "@/components/error-message";
import api from "@/lib/api";
import { spectrum } from "@/theme";
import sharePicture from "@/utils/share";

import type { Campaign } from "@/types/campaign";
import type { Location } from "@/types/location";
const defaultSize = 184;

interface ReferralDialogContentsProps {
  campaign: Campaign;
  location: Location;
  onSubmit: () => void;
}

type ReferralPostProps = {
  uuid: string;
};

type ReferralPostData = {
  qrcode: string;
  url: string;
};

function ReferralDialogContents({ campaign, location, onSubmit }: ReferralDialogContentsProps) {
  const { data, error, isError, isPending, mutate } = useMutation({
    mutationFn: async ({ uuid }: ReferralPostProps) => {
      return await api.post<ReferralPostData>(`merchant/action/referral/${uuid}`).json(); // TODO: add referral to searchParams
    },
  });

  const [sharing, setSharing] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);

  // run mutation on mount TODO: attach to a user interaction.
  useEffect(() => {
    mutate({ uuid: campaign.uuid });
  }, [mutate, campaign.uuid]);

  async function handleShare() {
    if (!data?.qrcode) {
      Toast.show({
        type: "error",
        text1: "Something Went Wrong",
        text2: "QR code not available",
      });
      return;
    }
    try {
      setSharing(true);
      await sharePicture(data.qrcode, location.name);
      Toast.show({
        type: "successToast",
        text1: "QR code shared successfully",
        text2: "Thank you for sharing!",
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : undefined;
      Toast.show({
        type: "error",
        text1: "Something Went Wrong",
        text2: errorMessage,
      });
    } finally {
      setSharing(false);
      setShowDoneButton(true);
    }
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Something Went Wrong</Text>
        <ErrorMessage error={error} size="large" style={{ paddingVertical: 8 }} />
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={spectrum.primary} />
      </View>
    );
  }

  if (!data?.qrcode) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Something Went Wrong</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: data.qrcode }} height={defaultSize} width={defaultSize} />
      <View style={{ alignItems: "center" }}>
        <Text style={styles.text}>Have the person scan this QR code</Text>
        <Text style={styles.text}>~ or ~</Text>
        <Text style={styles.text}>use this Share button</Text>
      </View>

      <View style={{ alignItems: "center", gap: 8 }}>
        <Button
          disabled={sharing}
          label={sharing ? "Sharing ..." : "Share Referral QR Code"}
          onPress={handleShare}
          size="md"
          variant={showDoneButton ? "outline" : "primary"}
        />
        {showDoneButton && <Button label="Done" onPress={onSubmit} size="md" variant="primary" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  text: {
    color: spectrum.base1Content,
    fontWeight: 400,
    textAlign: "center",
  },
});

export default ReferralDialogContents;
