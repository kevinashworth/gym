import { Image, StyleSheet, View, ImageStyle, ViewStyle } from "react-native";

import { spectrum } from "@/theme";

interface Props {
  source: { uri: string | null };
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
}

const ResponsiveImage = (props: Props) => {
  const { source, containerStyle, imageStyle } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      {source.uri ? (
        <Image
          style={[styles.image, imageStyle]}
          source={{ uri: source.uri }}
        />
      ) : (
        <View style={[styles.image, styles.placeholder, imageStyle as ViewStyle]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    aspectRatio: 1, // desired aspect ratio should be part of imageStyle prop
    borderRadius: 8,
    flex: 1,
    resizeMode: "contain",
  },
  placeholder: {
    backgroundColor: spectrum.base3Content,
  },
});

export default ResponsiveImage;
