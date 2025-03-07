import { Dimensions, StyleSheet, View } from "react-native";

import Placeholder from "@/assets/svgs/placeholder";
import Picture from "@/components/picture";
// import ResponsiveImage from "@/components/responsive-image"
import { spectrum } from "@/theme";
import chunk from "@/utils/chunk";

import { locals } from "./data";

const window = Dimensions.get("window");
const halfScreenWidthMinusPadding = window.width / 2 - 16;

export default function Communities() {
  return (
    <View style={styles.container}>
      {chunk(locals, 2).map((arr: any[], index: number) => (
        <View key={index} style={styles.innerContainer}>
          {arr.map((item: any) => (
            <View key={item.name} style={styles.communityContainer}>
              {/* <ResponsiveImage
                source={{ uri: item.image }}
                imageStyle={styles.imageStyle}
              /> */}
              <Picture
                source={{ uri: item.image }}
                height={128}
                width={halfScreenWidthMinusPadding}
                fallback={
                  <Placeholder
                    size={56}
                    color={spectrum.base3Content}
                    style={styles.fallbackIcon}
                  />
                }
                fallbackStyle={styles.fallback}
                imageStyle={styles.image}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  communityContainer: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    borderRadius: 8,
  },
  fallback: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  fallbackIcon: {
    marginTop: 6,
  },
  // imageStyle: {
  //   aspectRatio: 1.333,
  // }
});
