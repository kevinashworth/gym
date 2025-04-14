import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CircleHelp,
  CircleUserRound,
  CircleX,
  Eye,
  EyeOff,
  Heart,
  Image,
  Inbox,
  Map,
  MapPinOff,
  OctagonAlert,
  Search,
  SearchX,
  Square,
  SquareCheck,
  SquarePen,
  UsersRound,
  Wrench,
  X,
} from "lucide-react-native";
import { StyleProp, Text, ViewStyle } from "react-native";

import CampaignCheckIn from "@/assets/svg/campaign-check-in";
import CampaignCheckInQRCode from "@/assets/svg/campaign-check-in-qr-code";
import CampaignReferral from "@/assets/svg/campaign-referral";
import CampaignReview from "@/assets/svg/campaign-review";
import CampaignSurvey from "@/assets/svg/campaign-survey";
import { spectrum } from "@/theme";

const localIcons = {
  CampaignCheckIn: CampaignCheckIn,
  CampaignCheckInQRCode: CampaignCheckInQRCode,
  CampaignReferral: CampaignReferral,
  CampaignReview: CampaignReview,
  CampaignSurvey: CampaignSurvey,
};

const lucideIcons = {
  bell: Bell,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "circle-dollar-sign": CircleDollarSign,
  "circle-help": CircleHelp,
  "circle-user-round": CircleUserRound,
  "circle-x": CircleX,
  eye: Eye,
  "eye-off": EyeOff,
  heart: Heart,
  image: Image,
  inbox: Inbox,
  map: Map,
  "map-pin-off": MapPinOff,
  notifications: Bell,
  "octagon-alert": OctagonAlert,
  search: Search,
  "search-x": SearchX,
  square: Square,
  "square-check": SquareCheck,
  "square-pen": SquarePen,
  "users-round": UsersRound,
  wrench: Wrench,
  x: X,
};

export type IconName = keyof typeof localIcons | keyof typeof lucideIcons;

export type HistoryIconName = keyof typeof localIcons;

export interface IconProps {
  color?: string;
  fill?: string;
  name: IconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Icon({
  color = spectrum.base1Content,
  fill,
  name = "inbox",
  size = 28,
  style,
  ...props
}: IconProps) {
  if (name in localIcons) {
    const LocalIconComponent = localIcons[name as keyof typeof localIcons];
    return <LocalIconComponent color={color} size={size} style={style} {...props} />;
  }

  if (name in lucideIcons) {
    const LucideIconComponent = lucideIcons[name as keyof typeof lucideIcons];
    return (
      <LucideIconComponent
        color={color}
        fill={fill ? fill : "transparent"} // `fill` of `undefined` leads to a black fill, hence "transparent"
        size={size}
        style={style}
        {...props}
      />
    );
  }

  return <Text>?</Text>;
}
