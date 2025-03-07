import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import BottomGet from "@/assets/svgs/bottom-get";
import Picture from "@/components/picture";
import { spectrum } from "@/theme";

import { data5 as data } from "./data";

const width = 72;

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
                circular
                height={width}
                width={width}
                fallback={
                  <FontAwesome
                    name="heart-o"
                    size={56}
                    style={styles.fallbackIcon}
                  />
                }
                fallbackStyle={styles.fallback}
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
    fontSize: 12,
    marginTop: 12,
    maxWidth: width * 1.2,
    textAlign: "center",
    wordWrap: "break-word",
  },
  fallback: { backgroundColor: "#e0e0e0" },
  fallbackIcon: {
    color: spectrum.base3Content,
    marginTop: 6,
  },
});
