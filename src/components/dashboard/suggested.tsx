import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BottomGet from "@/assets/svg/bottom-get";
import Placeholder from "@/assets/svg/placeholder";
import Empty from "@/components/empty";
import ErrorMessage from "@/components/error-message";
import Picture from "@/components/picture";
import { useLocation } from "@/context/location";
import api from "@/lib/api";
import { spectrum } from "@/theme";

const width = 72;

interface Location {
  uuid: string;
  name: string;
  thumbnail: string | null;
  has_campaign: boolean;
}

export default function SuggestedLocations() {
  const { lat, lng } = useLocation();

  const { data, isFetching, error } = useQuery<Location[]>({
    queryKey: ["dashboard", "location", "suggested"], // "dashboard" and "location" are used for cache invalidation
    queryFn: () =>
      api
        .get("user/location/suggested", {
          searchParams: { lat, lng },
        })
        .json(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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
      <View style={[styles.container, styles.centerContent]}>
        <Empty />
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
    minHeight: width + 32, // Ensure consistent height
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
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
  emptyText: {
    fontSize: 14,
    color: spectrum.base1Content,
  },
  image: {
    borderRadius: 6,
  },
  fallback: {
    backgroundColor: spectrum.gray5,
    borderRadius: 6,
  },
});
