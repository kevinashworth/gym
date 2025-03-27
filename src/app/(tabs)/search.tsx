import { useCallback, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Stack } from "expo-router";
import { TimeoutError } from "ky";
import { useForm, Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { z } from "zod";

import BottomGet from "@/assets/svg/bottom-get";
import Placeholder from "@/assets/svg/placeholder";
import Button from "@/components/button";
import Empty from "@/components/empty";
import ErrorMessage from "@/components/error-message";
import FavoriteLocation from "@/components/favorite-location";
import FormErrorsMessage from "@/components/form-errors-message";
import Icon from "@/components/icon";
import Input from "@/components/input";
import Picture from "@/components/picture";
import { useLocation } from "@/context/location";
import api from "@/lib/api";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";

const window = Dimensions.get("window");
const screenWidthMinusPadding = window.width - 32;

interface Location {
  uuid: string;
  name: string;
  thumbnail: string | null;
  has_campaign: boolean;
  address: string;
}

const schema = z.object({
  query: z.string().min(3, { message: "Search query is required" }),
});

type FormValues = z.infer<typeof schema>;

export default function SearchTab() {
  const showPageInfo = useDevStore((s) => s.showPageInfo);
  const { errorMsg, isRequesting, hasPermission, retryPermission } = useLocation();

  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      query: "",
    },
    resolver: zodResolver(schema),
  });
  const queryText = watch("query");

  const [debouncedQueryText, setDebouncedQueryText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!queryText || queryText.length < 3) {
        setDebouncedQueryText("");
      } else {
        setDebouncedQueryText(queryText);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [queryText]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {errorMsg && (
        <View style={styles.errorContainer}>
          <ErrorMessage error={errorMsg} />
          {!hasPermission && (
            <Button
              activityIndicator={isRequesting}
              activityIndicatorColor={spectrum.primary}
              activityIndicatorSize="small"
              label="Enable Location"
              onPress={retryPermission}
              buttonStyle={styles.retryButton}
            />
          )}
        </View>
      )}
      <View style={styles.formContainer}>
        <View>
          <Text style={styles.inputLabel}>Search</Text>
        </View>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="query"
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="search stores near me"
                returnKeyType="search"
                style={styles.input}
                textContentType="none"
                value={value}
              />
            )}
          />
          {queryText && (
            <Pressable onPress={() => setValue("query", "")} style={styles.clearButton}>
              <Icon size={16} color={spectrum.primary} name="x" />
            </Pressable>
          )}
        </View>
        <View>
          <Button
            label="Go"
            onPress={() => setDebouncedQueryText(queryText)}
            disabled={!!errors.query}
            size="md"
          />
        </View>
      </View>
      <FormErrorsMessage errors={errors} name="query" />
      <SearchResults query={debouncedQueryText} />
      {showPageInfo && <Text style={styles.pageInfo}>src/app/(tabs)/search.tsx</Text>}
    </View>
  );
}

function FlatListItem({ item }: { item: Location }) {
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

function SearchResults({ query = "" }: { query: string }) {
  const { hasPermission, isRequesting, lat, lng, refreshLocation, retryPermission } = useLocation();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, error } = useQuery<Location[]>({
    queryKey: ["search", query],
    queryFn: () => {
      return api.get("user/location/search", { searchParams: { query, lat, lng } }).json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshLocation().then(() => {
      queryClient
        .refetchQueries({
          queryKey: ["search"],
        })
        .then(() => setRefreshing(false));
    });
  }, [refreshLocation, queryClient]);

  // If location permission is not granted or lat/lng are undefined, show a message
  if (!hasPermission || !lat || !lng) {
    return (
      <View style={styles.locationPermissionContainer}>
        <Empty icon="map-pin-off" iconSize={32} text="Location Access Required" vertical />
        <Text style={styles.locationPermissionText}>
          To search for stores near you, we need access to your location.
        </Text>
        <Text style={styles.locationInstructionsText}>How to enable location access:</Text>
        <Text style={styles.locationInstructionsList}>
          1. Go to your device Settings{"\n"}
          2. Find this app in the list{"\n"}
          3. Tap on "Location"{"\n"}
          4. Select "Allow while using the app"
        </Text>
        <Button
          activityIndicator={isRequesting}
          activityIndicatorColor={spectrum.primary}
          activityIndicatorSize="small"
          label="Enable Location"
          onPress={retryPermission}
          buttonStyle={styles.locationPermissionButton}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error) {
    let errorMessage = "Sorry, your search request failed to get any results.";
    if (error instanceof TimeoutError) {
      errorMessage = "Sorry, your search request timed out.";
    } else if (error instanceof Error && error.message === "Location data is required for search") {
      errorMessage = "Location data is required to search for stores near you.";
    }
    return (
      <View>
        <ErrorMessage error={errorMessage} />
        <Button
          label="Retry with Location"
          onPress={refreshLocation}
          buttonStyle={styles.retryButton}
        />
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View>
        <Empty icon="search-x" iconSize={20} text="Sorry, no results found near you" vertical />
      </View>
    );
  }

  const ListHeader = () => (
    <Text style={styles.searchResultsTitle}>
      {query ? "Search Results Near You" : "Stores Near You"}
    </Text>
  );

  const ListFooter = () => <View style={styles.listFooter} />;

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  formContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
    width: screenWidthMinusPadding,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    color: spectrum.base1Content,
    fontSize: 14,
    paddingRight: 32,
    paddingVertical: 6,
  },
  clearButton: {
    position: "absolute",
    right: 7,
    top: 7,
    zIndex: 10,
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
  pageInfo: {
    borderTopColor: spectrum.base3Content,
    borderTopWidth: 1,
    color: spectrum.base1Content,
    fontSize: 11,
    fontWeight: 300,
    marginVertical: 12,
    paddingVertical: 12,
    textAlign: "center",
  },
  errorContainer: {
    width: "100%",
    marginBottom: 16,
    alignItems: "center",
  },
  retryButton: {
    marginTop: 8,
  },
  listFooter: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: spectrum.black,
  },
  locationPermissionContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  locationPermissionText: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
  },
  locationInstructionsText: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 4,
  },
  locationInstructionsList: {
    fontSize: 13,
    fontWeight: 300,
    marginBottom: 16,
  },
  locationPermissionButton: {
    marginTop: 8,
  },
});
