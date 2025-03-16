import { StyleProp, View, ViewStyle } from "react-native";

interface YStackProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  [key: string]: any; // Include other props if needed
}

function YStack({ children, style, ...props }: YStackProps) {
  const yStyle: ViewStyle = {
    // alignItems: "center",
    flex: 1,
    flexDirection: "column",
    // justifyContent: "flex-start",
  };

  const viewStyle: StyleProp<ViewStyle> = [yStyle, style];

  return (
    <View style={viewStyle} {...props}>
      {children}
    </View>
  );
}

export default YStack;
