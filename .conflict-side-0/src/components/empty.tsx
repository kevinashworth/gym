import { Text, ViewStyle } from "react-native";

import Icon, { FontAwesomeIconName } from "@/components/icon";
import XStack from "@/components/x-stack";
import YStack from "@/components/y-stack";
import { spectrum } from "@/theme";

interface EmptyProps {
  icon?: FontAwesomeIconName;
  style?: ViewStyle;
  text?: string;
  textProps?: any;
  vertical?: boolean;
}

export default function Empty({
  icon = "inbox",
  style,
  text = "No Data",
  textProps = {},
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

  const textStyle = {
    color: spectrum.base3Content,
    fontSize: 10,
    ...textProps,
  };

  return (
    <Stack style={containerStyle}>
      <Icon name={icon} color={spectrum.base3Content} />
      <Text style={textStyle}>{text}</Text>
    </Stack>
  );
}
