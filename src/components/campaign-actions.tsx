import { View } from "react-native";

import CampaignCheckIn from "@/assets/svg/campaign-check-in";
import CampaignReferral from "@/assets/svg/campaign-referral";
import CampaignReview from "@/assets/svg/campaign-review";
import CampaignSurvey from "@/assets/svg/campaign-survey";
import Button from "@/components/campaign-button";
import chunk from "@/utils/chunk";

const campaignTypes: {
  type: string;
  name: string;
  icon: string;
  iconComponent: React.ReactElement;
}[] = [
  {
    type: "CheckIn",
    name: "Check-In",
    icon: "CampaignCheckIn",
    iconComponent: <CampaignCheckIn />,
  },
  {
    type: "Review",
    name: "Review",
    icon: "CampaignReview",
    iconComponent: <CampaignReview />,
  },
  {
    type: "Referral",
    name: "Referral",
    icon: "CampaignReferral",
    iconComponent: <CampaignReferral />,
  },
  {
    type: "Survey",
    name: "Survey",
    icon: "CampaignSurvey",
    iconComponent: <CampaignSurvey />,
  },
];

export default function CampaignActions() {
  return (
    <View style={{ gap: 8, marginBottom: 16, marginTop: 8 }}>
      {chunk(campaignTypes, 2).map((arr: any[], index: number) => (
        <View key={index} style={{ gap: 8, flexDirection: "row" }}>
          {arr.map(({ type, name, icon, iconComponent }) => (
            <View key={type}>
              <Button icon={iconComponent} label={name} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
