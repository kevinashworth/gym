import { Text, TextStyle, View, ViewStyle } from "react-native";

import Icon, { IconName } from "@/components/icon";
import { spectrum } from "@/theme";

interface EmptyProps {
  icon?: IconName;
  iconColor?: string;
  iconSize?: number;
  style?: ViewStyle;
  text?: string;
  textStyle?: TextStyle;
  vertical?: boolean;
}

export default function Empty({
  icon = "inbox",
  iconColor,
  iconSize,
  style,
  text = "No Data",
  textStyle = {},
  vertical = false,
}: EmptyProps) {
  const flexDirection = vertical ? "column" : "row";

  const containerStyle = {
    ...style,
    alignItems: "center",
    // justifyContent: "center",
    flexDirection,
    gap: vertical ? 4 : 8,
  } as ViewStyle;

  const textStyleCombined = {
    color: spectrum.base3Content,
    fontSize: 10,
    ...textStyle,
  };

  return (
    <View style={containerStyle}>
      <Icon name={icon} color={iconColor || spectrum.base3Content} size={iconSize} />
      <Text style={textStyleCombined}>{text}</Text>
    </View>
  );
}
