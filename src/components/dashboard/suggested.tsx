import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import BottomGet from "@/assets/svgs/bottom-get";
import Placeholder from "@/assets/svgs/placeholder";
import Picture from "@/components/picture";
import { spectrum } from "@/theme";

import { data10 as data } from "./data";

const width = 76;

export default function Favorites() {
  return (
    <View style={styles.container}>
      {data.map(({ uuid, name, thumbnail, has_campaign }) => (
        <Link href="/" asChild key={uuid}>
          <Pressable>
            <View style={styles.favoriteContainer}>
              <Picture
                source={{ uri: thumbnail }}
                badge={<BottomGet size={18} />}
                showBadge={has_campaign}
                height={width}
                width={width}
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
              <Text style={styles.text} numberOfLines={2}>
                {name}
              </Text>
            </View>
          </Pressable>
        </Link>
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
  favoriteContainer: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  text: {
    fontSize: 10,
    marginTop: 2,
    maxWidth: width * 1.2,
    textAlign: "center",
    wordWrap: "break-word",
  },
  image: {
    borderRadius: 8,
    height: width - 4,
    margin: 2,
    padding: 2,
    width: width - 4,
  },
  fallback: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    height: width - 4,
    margin: 2,
    padding: 2,
    width: width - 4,
  },
  fallbackIcon: {
    marginTop: 6,
  },
});
