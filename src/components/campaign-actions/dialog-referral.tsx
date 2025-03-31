import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";

import Button from "@/components/button";
import { spectrum } from "@/theme";

import type { Location } from "@/types/location";
const defaultSize = 164;

interface ReferralDialogContentsProps {
  isMutating: boolean;
  location: Location;
  onSubmit: () => void;
  sharing: boolean;
  handleReferral: () => void;
  mutateResult: { qrcode: string };
}

function ReferralDialogContents({
  isMutating,
  location,
  onSubmit,
  sharing,
  handleReferral,
  mutateResult,
}: ReferralDialogContentsProps) {
  return (
    <View style={styles.container}>
      {isMutating && <ActivityIndicator size="large" color={spectrum.primary} />}
      <View style={{ alignItems: "center", gap: 8 }}>
        <Image
          source={{ uri: mutateResult.qrcode }}
          height={defaultSize}
          width={defaultSize}
          style={{ backgroundColor: "cyan" }}
        />
        <View style={{ alignItems: "center" }}>
          <Text style={styles.text}>Have the person scan the code</Text>
          <Text style={styles.text}>Or</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Button
            disabled={isMutating || sharing}
            label={sharing ? "Sharing ..." : "Share a Referral"}
            onPress={handleReferral}
            size="md"
            variant="primary"
          />
        </View>
      </View>
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
    fontWeight: 400,
    textAlign: "center",
  },
});

export default ReferralDialogContents;
