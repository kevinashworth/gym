import React, { useState } from "react";

import { Image, View, StyleSheet, ImageStyle, ViewStyle } from "react-native";

interface PictureProps {
  badge?: React.ReactElement;
  circular?: boolean;
  containerStyle?: ViewStyle;
  fallback: React.ReactElement<{ size: number }>;
  fallbackStyle?: ViewStyle;
  height?: number;
  imageStyle?: ImageStyle;
  showBadge?: boolean;
  source: { uri: string | null | undefined };
  width?: number;
}

const defaultSize = 144;

const Picture: React.FC<PictureProps> = ({
  badge,
  circular = false,
  containerStyle,
  fallback,
  fallbackStyle,
  height: heightProp = defaultSize,
  imageStyle,
  showBadge = false,
  source,
  width: widthProp = defaultSize,
}) => {
  const w = circular ? Math.min(heightProp, widthProp) : widthProp;
  const h = circular ? Math.min(heightProp, widthProp) : heightProp;
  const borderRadius = circular ? "50%" : 0;

  const [imageError, setImageError] = useState(source.uri === null || source.uri === undefined);

  const handleImageError = () => {
    setImageError(true);
  };

  const containerStyles = [styles.container, { height: h, width: w, borderRadius }, containerStyle];

  const imageStyles = [styles.image, { height: h, width: w, borderRadius }, imageStyle];

  const fallbackStyles = [styles.fallback, { height: h, width: w, borderRadius }, fallbackStyle];

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
        {source && source.uri && !imageError ? (
          <Image
            source={source as { uri: string }}
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
