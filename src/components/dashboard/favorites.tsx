import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import BottomGet from "@/assets/svg/bottom-get";
import Picture from "@/components/picture";
import { favorites } from "@/mocks/fixtures";
import { spectrum } from "@/theme";

const width = 72;

export default function Favorites() {
  return (
    <View style={styles.container}>
      {favorites.map(({ uuid, name, thumbnail, has_campaign }) => (
        <Link href={`/location/${uuid}`} asChild key={uuid}>
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
                    size={width - 16}
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
  fallback: { backgroundColor: spectrum.gray5 },
  fallbackIcon: {
    color: spectrum.base3Content,
    marginTop: 6,
  },
});
