import React from "react";

import { Image, View, StyleSheet, ImageStyle, ViewStyle } from "react-native";

interface PictureProps {
  badge?: React.ReactElement;
  circular?: boolean;
  containerStyle?: ViewStyle;
  fallback: React.ReactElement<{ size: number }>;
  fallbackStyle?: ViewStyle;
  height: number;
  imageStyle?: ImageStyle;
  showBadge?: boolean;
  source: { uri: string };
  width?: number;
}

const Picture: React.FC<PictureProps> = ({
  badge,
  circular = false,
  containerStyle,
  fallback,
  fallbackStyle,
  height,
  imageStyle,
  showBadge = false,
  source,
  width: widthProp,
}) => {
  const width = widthProp || height;
  const w = circular ? Math.min(height, width) : width;
  const h = circular ? Math.min(height, width) : height;
  const borderRadius = circular ? "50%" : 0;

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const containerStyles = [
    styles.container,
    { height: h, width: w, borderRadius },
    containerStyle,
  ];

  const imageStyles = [
    styles.image,
    { height: h, width: w, borderRadius },
    imageStyle,
  ];

  const fallbackStyles = [
    styles.fallback,
    { height: h, width: w, borderRadius },
    fallbackStyle,
  ];

  const badgeStyles = [
    styles.badge,
    {
      top: circular ? 0 : -2,
      right: circular ? 0 : -2,
    },
  ];

  return (
    <View style={styles.picture}>
      <View style={containerStyles}>
        {!imageError ? (
          <Image
            source={source}
            style={imageStyles}
            onError={handleImageError}
          />
        ) : (
          <View style={fallbackStyles}>{fallback}</View>
        )}
      </View>
      {showBadge && <View style={badgeStyles}>{badge}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  picture: {
    position: "relative",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 0,
  },
  badge: {
    position: "absolute",
  },
  fallback: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Picture;
