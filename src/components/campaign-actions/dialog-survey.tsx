import { StyleSheet, View } from "react-native";

import SurveyComponent from "@/components/campaign-actions/survey";

import type { Campaign } from "@/types/campaign";
import type { Location } from "@/types/location";

interface SurveyDialogProps {
  campaign: Campaign;
  location: Location;
  onSubmit: () => void;
}

function SurveyDialogContents({ campaign, location, onSubmit }: SurveyDialogProps) {
  return (
    <View style={styles.container}>
      <SurveyComponent
        location_uuid={location.uuid}
        campaign_uuid={campaign.uuid}
        isMutating={false}
        handleSurvey={() => {}}
      />
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
});

export default SurveyDialogContents;
