import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import BottomGet from "@/assets/svg/bottom-get";
import Placeholder from "@/assets/svg/placeholder";
import Picture from "@/components/picture";
import { suggested } from "@/mocks/fixtures";
import { spectrum } from "@/theme";

const width = 72;

interface SuggestedProps {
  numToDisplay?: number;
}

export default function Suggested({
  numToDisplay = suggested.length,
}: SuggestedProps) {
  return (
    <View style={styles.container}>
      {suggested
        .slice(0, numToDisplay)
        .map(({ uuid, name, thumbnail, has_campaign }) => (
          <Link href="/" asChild key={uuid}>
            <Pressable>
              <View style={styles.favoriteContainer}>
                <Picture
                  source={{ uri: thumbnail }}
                  height={width}
                  width={width}
                  fallback={
                    <Placeholder
                      color={spectrum.base3Content}
                      size={width - 20}
                    />
                  }
                  fallbackStyle={styles.fallback}
                  imageStyle={styles.image}
                />
                {has_campaign && (
                  <BottomGet
                    style={{
                      position: "absolute",
                      right: -6,
                      top: -6,
                    }}
                    size={18}
                  />
                )}
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
    alignItems: "center",
    flex: 1,
    marginTop: 6,
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
    borderRadius: 6,
  },
  fallback: {
    backgroundColor: spectrum.gray5,
    borderRadius: 6,
  },
});
