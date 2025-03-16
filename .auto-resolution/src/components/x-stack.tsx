import { StyleProp, View, ViewStyle } from "react-native";

interface XStackProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  [key: string]: any; // Include other props if needed
}

function XStack({ children, style, ...props }: XStackProps) {
  const xStyle: ViewStyle = {
    // alignItems: "center",
    // flex: 1,
    flexDirection: "row",
    // justifyContent: "flex-start",
  };

  const viewStyle: StyleProp<ViewStyle> = [xStyle, style];

  return (
    <View style={viewStyle} {...props}>
      {children}
    </View>
  );
}

export default XStack;
