import { StyleSheet, Text, TextStyle, View } from "react-native";
import Svg, { G, Path, Defs, LinearGradient, Stop, ClipPath } from "react-native-svg";

const SvgComponent = ({ color = "#0047B8", size = 24, ...props }) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 12 12" {...props}>
    <G clipPath="url(#a)">
      <Path fill="url(#b)" d="M6 12A6 6 0 1 0 6 0a6 6 0 0 0 0 12Z" />
      <Path fill="url(#c)" d="M6 11.424A5.424 5.424 0 1 0 6 .576a5.424 5.424 0 0 0 0 10.848Z" />
      <Path
        fill={color}
        d="M6 1.272A4.722 4.722 0 0 0 1.272 6 4.722 4.722 0 0 0 6 10.728 4.722 4.722 0 0 0 10.728 6 4.722 4.722 0 0 0 6 1.272Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={7.992}
        x2={4.827}
        y1={1.661}
        y2={8.556}
        gradientUnits="userSpaceOnUse">
        <Stop offset={0.348} stopColor={color} />
        <Stop offset={0.626} stopColor="#fff" />
        <Stop offset={1} stopColor={color} />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={2.69}
        x2={6.925}
        y1={1.355}
        y2={7.297}
        gradientUnits="userSpaceOnUse">
        <Stop offset={0.348} stopColor={color} />
        <Stop offset={0.626} stopColor="#fff" />
        <Stop offset={1} stopColor={color} />
      </LinearGradient>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h12v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

interface IconCoinsProps {
  quantity: number;
  size?: number;
  textStyle?: TextStyle;
}

function IconCoins({ quantity, textStyle, size = 24, ...props }: IconCoinsProps) {
  const dynamicStyles = {
    width: size,
    height: size,
  };
  const fontSize = size * (16 / 24);

  return (
    <View style={[styles.container, dynamicStyles]}>
      <View style={[styles.svg, dynamicStyles]}>
        <SvgComponent size={size} {...props} />
      </View>
      <View style={[styles.text, dynamicStyles]}>
        <Text style={[{ color: "white", fontSize, fontWeight: "bold" }, textStyle]}>
          {quantity}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
    // flexDirection: "row",
    position: "relative",
  },
  svg: {
    // justifyContent: "center",
    // alignItems: "center",
  },
  text: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IconCoins;
