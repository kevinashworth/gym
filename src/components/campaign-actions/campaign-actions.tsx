import { useState } from "react";

import { groupBy } from "lodash-es";
import { View, Text, StyleSheet } from "react-native";

import CampaignButton from "@/components/campaign-actions/campaign-button";
import Dialog from "@/components/campaign-actions/dialog";
import CheckInDialog from "@/components/campaign-actions/dialog-checkin";
import ReferralDialog from "@/components/campaign-actions/dialog-referral";
import ReviewDialog from "@/components/campaign-actions/dialog-review";
import SurveyDialog from "@/components/campaign-actions/dialog-survey";
import chunk from "@/utils/chunk";

import type { Campaign, CampaignType } from "@/types/campaign";
import type { Location } from "@/types/location";

type CampaignButtonType = {
  iconName: "CampaignCheckIn" | "CampaignReview" | "CampaignReferral" | "CampaignSurvey";
  name: string;
  type: CampaignType;
};

const campaignTypes: CampaignButtonType[] = [
  {
    iconName: "CampaignCheckIn",
    name: "Check-In",
    type: "CheckIn",
  },
  {
    iconName: "CampaignReview",
    name: "Review",
    type: "Review",
  },
  {
    iconName: "CampaignReferral",
    name: "Referral",
    type: "Referral",
  },
  {
    iconName: "CampaignSurvey",
    name: "Survey",
    type: "Survey",
  },
];

interface CampaignActionsProps {
  location: Location;
}

export default function CampaignActions({ location }: CampaignActionsProps) {
  const { campaigns } = location;
  const groupedCampaigns = groupBy(campaigns, "campaign_type");

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaignType, setCampaignType] = useState<CampaignType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {chunk(campaignTypes, 2).map((arr: CampaignButtonType[], index: number) => (
        <View key={index} style={styles.row}>
          {arr.map(({ iconName, name, type }) => (
            <CampaignButton
              coins={groupedCampaigns[type]?.[0]?.reward}
              disabled={!groupedCampaigns[type]}
              iconName={iconName}
              key={type}
              label={name}
              onPress={() => {
                setCampaign(groupedCampaigns[type]?.[0]);
                setCampaignType(type);
                setModalVisible(true);
              }}
            />
          ))}
        </View>
      ))}
      <Dialog isVisible={modalVisible} onHide={() => setModalVisible(false)}>
        <Text style={styles.nameHeading}>{location.name}</Text>
        {campaignType === "CheckIn" && !!campaign && (
          <CheckInDialog campaign={campaign} onSubmit={() => setModalVisible(false)} />
        )}
        {campaignType === "Referral" && !!campaign && (
          <ReferralDialog
            campaign={campaign}
            location={location}
            onSubmit={() => setModalVisible(false)}
          />
        )}
        {campaignType === "Review" && !!campaign && (
          <ReviewDialog
            campaign={campaign}
            location={location}
            onSubmit={() => setModalVisible(false)}
          />
        )}
        {campaignType === "Survey" && !!campaign && (
          <SurveyDialog
            campaign={campaign}
            location={location}
            onSubmit={() => setModalVisible(false)}
          />
        )}
      </Dialog>
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
  row: {
    flexDirection: "row",
    gap: 8,
  },
  nameHeading: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8,
    paddingBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: "center",
  },
  locationName: {
    fontSize: 16,
    fontWeight: 500,
  },
});
