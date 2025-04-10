import React, { useCallback, useState } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BottomGet from "@/assets/svg/bottom-get";
import Placeholder from "@/assets/svg/placeholder";
import Empty from "@/components/empty";
import ErrorMessage from "@/components/error-message";
import FavoriteLocation from "@/components/favorite-location";
import CustomHeader from "@/components/header";
import Picture from "@/components/picture";
import { useGeoLocation } from "@/context/location";
import api from "@/lib/api";
import { spectrum } from "@/theme";
import capitalize from "@/utils/capitalize";

const window = Dimensions.get("window");
const screenWidthMinusPadding = window.width - 32;

interface CategoryLocation {
  address: string;
  distance: number;
  has_campaign: boolean;
  name: string;
  thumbnail: string | null;
  uuid: string;
}

export default function CategoriesScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const categoryName = capitalize(id);

  const router = useRouter();

  const handleGoBack = () => (router.canGoBack() ? router.back() : router.replace("/(tabs)"));

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ header: () => <CustomHeader /> }} />
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={32} color={spectrum.primary} />
        </TouchableOpacity>
        <Text style={styles.h3}>{categoryName}</Text>
      </View>
      <CategoryResults categoryName={categoryName} id={id} />
    </View>
  );
}

function FlatListItem({ item }: { item: CategoryLocation }) {
  const { uuid, name, thumbnail, has_campaign, address } = item;
  const pictureWidth = 72;
  return (
    <Link href={`/location/${uuid}`} asChild>
      <Pressable>
        <View style={styles.locationContainer}>
          <View>
            <Picture
              source={{ uri: thumbnail }}
              height={pictureWidth}
              width={pictureWidth}
              fallback={<Placeholder color={spectrum.base3Content} size={pictureWidth - 20} />}
              fallbackStyle={styles.fallback}
              imageStyle={styles.image}
            />
            {has_campaign && (
              <BottomGet style={{ position: "absolute", right: -6, top: -6 }} size={18} />
            )}
          </View>
          <View style={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }}>
            <View style={{ flex: 1, justifyContent: "space-evenly" }}>
              <Text style={styles.textName} numberOfLines={2}>
                {name}
              </Text>
              <Text style={styles.textAddress} numberOfLines={2}>
                {address}
              </Text>
              <Text style={styles.textAddress}>{item.distance.toFixed(2)} miles away</Text>
            </View>
          </View>
          <View style={{ justifyContent: "center" }}>
            <FavoriteLocation uuid={uuid} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

function CategoryResults({ categoryName = "", id = "" }: { categoryName: string; id: string }) {
  const { lat, lng, refreshGeoLocation } = useGeoLocation();

  const searchParams =
    typeof lat === "number" && typeof lng === "number" ? { lat, lng } : undefined;

  const { data, isLoading, error, refetch } = useQuery<CategoryLocation[]>({
    enabled: !!searchParams,
    queryKey: ["category", { id, lat, lng }],
    queryFn: () => {
      return api.get<CategoryLocation[]>(`user/location/category/${id}`, { searchParams }).json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshGeoLocation()
      .then(() => {
        refetch();
      })
      .then(() => setRefreshing(false));
  }, [refreshGeoLocation, refetch]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <ErrorMessage error={error.message} />
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View>
        <Empty
          icon="search-x"
          iconSize={20}
          text={`Sorry, no ${categoryName} found near you`}
          vertical
        />
      </View>
    );
  }

  const ListHeader = () => <Text style={styles.searchResultsTitle}>{categoryName} Near You</Text>;

  const ListFooter = () => <View style={styles.listFooter} />;

  return (
    <View style={styles.centerContent}>
      <View style={styles.searchResultsContainer}>
        <FlatList
          data={data}
          renderItem={FlatListItem}
          keyExtractor={(item) => item.uuid}
          ListHeaderComponent={data.length ? ListHeader : null}
          ListFooterComponent={data.length ? ListFooter : null}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              tintColor={spectrum.primary}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-start",
    paddingVertical: 12,
  },
  h3: {
    color: spectrum.base1Content,
    fontSize: 24,
    fontWeight: 500,
  },
  searchResultsContainer: {
    marginBottom: 16,
    width: screenWidthMinusPadding,
  },
  searchResultsTitle: {
    fontSize: 14,
    fontWeight: 500,
    paddingTop: 12,
  },
  listFooter: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: spectrum.black,
  },
  locationContainer: {
    borderBottomColor: "black",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 16,
    paddingVertical: 4,
    position: "relative",
  },
  textName: {
    fontSize: 14,
    fontWeight: 500,
  },
  textAddress: {
    flexWrap: "wrap",
    fontSize: 13,
    fontWeight: 300,
    wordWrap: "break-word",
  },
  fallback: {
    backgroundColor: spectrum.gray5,
    borderRadius: 6,
  },
  image: {
    borderRadius: 6,
  },
});
