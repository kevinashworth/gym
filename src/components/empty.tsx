import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

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
  textStyle,
  vertical = false,
}: EmptyProps) {
  const flexDirection = vertical ? "column" : "row";
  const gap = vertical ? 4 : 8;

  return (
    <View style={[styles.container, style, { flexDirection, gap }]}>
      <Icon name={icon} color={iconColor || spectrum.base3Content} size={iconSize} />
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: spectrum.base3Content,
    fontSize: 12,
  },
});
