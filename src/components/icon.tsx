import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Bell,
  ChevronRight,
  CircleDollarSign,
  CircleHelp,
  CircleUserRound,
  Image,
  UsersRound,
} from "lucide-react-native";

import CampaignCheckIn from "@/assets/svg/campaign-check-in";
import CampaignCheckInQRCode from "@/assets/svg/campaign-check-in-qr-code";
import CampaignReferral from "@/assets/svg/campaign-referral";
import CampaignReview from "@/assets/svg/campaign-review";
import CampaignSurvey from "@/assets/svg/campaign-survey";
import { spectrum } from "@/theme";

export type FontAwesomeIconName = React.ComponentProps<
  typeof FontAwesome
>["name"];

export type FontAwesomeIconStyle = React.ComponentProps<
  typeof FontAwesome
>["style"];

const localIcons = {
  "campaign-check-in": CampaignCheckIn,
  "campaign-check-in-qr-code": CampaignCheckInQRCode,
  "campaign-referral": CampaignReferral,
  "campaign-review": CampaignReview,
  "campaign-survey": CampaignSurvey,
  CampaignCheckIn: CampaignCheckIn,
  CampaignCheckInQRCode: CampaignCheckInQRCode,
  CampaignReferral: CampaignReferral,
  CampaignReview: CampaignReview,
  CampaignSurvey: CampaignSurvey,
};

const lucideIcons = {
  bell: Bell,
  "chevron-right": ChevronRight,
  "circle-dollar-sign": CircleDollarSign,
  "circle-help": CircleHelp,
  "circle-user-round": CircleUserRound,
  image: Image,
  notifications: Bell,
  "users-round": UsersRound,
};

export type IconName =
  | FontAwesomeIconName
  | keyof typeof lucideIcons
  | keyof typeof localIcons;

interface IconProps {
  color?: string;
  name: IconName;
  size?: number;
  style?: FontAwesomeIconStyle;
}

export default function Icon({
  color = spectrum.base1Content,
  name = "inbox",
  size = 28,
  style,
  ...props
}: IconProps) {
  if (name in localIcons) {
    const LocalIconComponent = localIcons[name as keyof typeof localIcons];
    return (
      <LocalIconComponent color={color} size={size} style={style} {...props} />
    );
  }

  if (name in lucideIcons) {
    const LucideIconComponent = lucideIcons[name as keyof typeof lucideIcons];
    return <LucideIconComponent color={color} size={size} {...props} />;
  }

  return (
    <FontAwesome
      color={color}
      name={name as FontAwesomeIconName}
      size={size}
      style={style}
      {...props}
    />
  );
}
