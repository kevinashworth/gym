import { Text, TextStyle, ViewStyle } from "react-native";

import Icon, { FontAwesomeIconName } from "@/components/icon";
import XStack from "@/components/x-stack";
import YStack from "@/components/y-stack";
import { spectrum } from "@/theme";

interface EmptyProps {
  icon?: FontAwesomeIconName;
  style?: ViewStyle;
  text?: string;
  textStyle?: TextStyle;
  vertical?: boolean;
}

export default function Empty({
  icon = "inbox",
  style,
  text = "No Data",
  textStyle = {},
  vertical = false,
  ...props
}: EmptyProps) {
  const Stack = vertical ? YStack : XStack;

  const containerStyle = {
    ...style,
    alignItems: "center",
    justifyContent: "center",
    gap: vertical ? 0 : 8,
  } as ViewStyle;

  const textStyleCombined = {
    color: spectrum.base3Content,
    fontSize: 10,
    ...textStyle,
  };

  return (
    <Stack style={containerStyle}>
      <Icon name={icon} color={spectrum.base3Content} />
      <Text style={textStyleCombined}>{text}</Text>
    </Stack>
  );
}
