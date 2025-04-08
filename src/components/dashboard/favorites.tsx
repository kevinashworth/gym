import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import BottomGet from "@/assets/svg/bottom-get";
import Empty from "@/components/empty";
import ErrorMessage from "@/components/error-message";
import Icon from "@/components/icon";
import Picture from "@/components/picture";
import { useLocation } from "@/context/location";
import api from "@/lib/api";
import { spectrum } from "@/theme";

const width = 72;

type Favorite = {
  uuid: string;
  name: string;
  thumbnail: string;
  has_campaign: boolean;
};

interface FavoritesProps {
  disabled?: boolean;
}

export default function Favorites({ disabled }: FavoritesProps) {
  const { lat, lng } = useLocation();

  const searchParams =
    typeof lat === "number" && typeof lng === "number" ? { lat, lng } : undefined;

  const { data, isFetching, error } = useQuery<Favorite[]>({
    enabled: !!searchParams && !disabled,
    queryKey: ["dashboard", "location", "favorites", searchParams],
    queryFn: () => api.get("user/location/favorites", { searchParams }).json(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (disabled || !searchParams) {
    return (
      <View style={styles.container}>
        <Empty icon="map-pin-off" text="To find favorites, allow access to your location." />
      </View>
    );
  }

  if (isFetching) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={spectrum.base1Content} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ErrorMessage error={error.message} />
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View style={[styles.container]}>
        <Empty
          icon="heart"
          text="When you like a store, click Add to Favorites."
          textStyle={styles.emptyText}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.map(({ uuid, name, thumbnail, has_campaign }) => (
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
                  <Icon
                    color={spectrum.base3Content}
                    name="heart"
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
    minHeight: width + 42, // Ensure consistent height
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
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
  emptyText: {
    fontSize: 14,
    color: spectrum.base1Content,
  },
  fallback: {
    backgroundColor: spectrum.gray5,
  },
  fallbackIcon: {
    marginTop: 6,
  },
  locationPermissionText: {
    fontSize: 12,
    marginTop: 12,
    color: spectrum.base1Content,
  },
});
