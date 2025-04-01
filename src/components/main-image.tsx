import { useEffect, useState } from "react";

import { Dimensions, Image, StyleSheet } from "react-native";

import Placeholder from "@/assets/svg/placeholder";
import Picture from "@/components/picture";
import { spectrum } from "@/theme";
import clamp from "@/utils/clamp";

import type { Location } from "@/types/location";

type ImageWithSize = {
  url: string;
  width: number;
  height: number;
};

const window = Dimensions.get("window");
const halfScreenWidthMinusPadding = window.width / 2 - 16;

const defaultSize = 164;
const defaultDimensions = { width: defaultSize, height: defaultSize };

interface MainImageProps {
  location: Location;
}

function MainImage({ location }: MainImageProps) {
  const [mainImageWithSize, setMainImageWithSize] = useState<ImageWithSize>({
    ...defaultDimensions,
    url: "",
  });

  useEffect(() => {
    if (!location) return;
    const mainImage = location.business_logo || location.external_thumbnail_1 || "";
    if (mainImage) {
      Image.getSize(mainImage, (width, height) => {
        const aspectRatio = clamp(0.75, width / height, 1.25);
        const w = halfScreenWidthMinusPadding;
        const h = halfScreenWidthMinusPadding / aspectRatio;
        setMainImageWithSize({ url: mainImage, width: w, height: h });
      });
    }
  }, [location]);

  return (
    <Picture
      source={{ uri: mainImageWithSize.url }}
      height={mainImageWithSize.height}
      width={mainImageWithSize.width}
      fallback={<Placeholder color={spectrum.base3Content} size={mainImageWithSize.width * 0.75} />}
      fallbackStyle={styles.fallback}
      imageStyle={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: spectrum.gray5,
    borderRadius: 6,
  },
  image: {
    borderRadius: 6,
  },
});

export default MainImage;
