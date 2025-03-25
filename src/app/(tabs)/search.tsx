import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Link, Stack } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
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

const pictureWidth = 72;

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
    if (!queryText) setDebouncedQueryText("");
    if (queryText?.length < 3) return;
    const timer = setTimeout(() => setDebouncedQueryText(queryText), 300);
    return () => clearTimeout(timer);
  }, [queryText]);

  return (
    <ScrollView>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
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
              <Pressable
                onPress={() => setValue("query", "")}
                style={styles.clearButton}
              >
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
        <SearchResults queryText={debouncedQueryText} />
        {showPageInfo && (
          <Text style={styles.pageInfo}>src/app/(tabs)/search.tsx</Text>
        )}
      </View>
    </ScrollView>
  );
}

function SearchResults({ queryText = "" }: { queryText: string }) {
  const { lat, lng } = useLocation();

  const { data, isLoading, error } = useQuery<Location[]>({
    queryKey: ["search", queryText],
    queryFn: () =>
      api
        .get("user/location/search", {
          searchParams: { query: queryText, lat, lng },
        })
        .json(),
  });

  if (isLoading) {
    return (
      <View style={[styles.searchResultsContainer, styles.centerContent]}>
        <ActivityIndicator size="large" color={spectrum.base1Content} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.searchResultsContainer, styles.centerContent]}>
        <ErrorMessage error={error?.message} />
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View style={[styles.centerContent, { marginTop: 16 }]}>
        <Empty
          icon="search-x"
          iconSize={20}
          text="Sorry, no results found near you"
          vertical
        />
      </View>
    );
  }

  return (
    <View style={styles.searchResultsContainer}>
      {queryText && data?.length && (
        <Text style={styles.searchResultsTitle}>Search Results Near You</Text>
      )}
      {!queryText && data?.length && (
        <Text style={styles.searchResultsTitle}>Stores Near You</Text>
      )}
      {data.map(({ uuid, name, thumbnail, has_campaign, address }) => (
        <Link href={`/location/${uuid}`} asChild key={uuid}>
          <Pressable>
            <View style={styles.locationContainer}>
              <View>
                <Picture
                  source={{ uri: thumbnail }}
                  height={pictureWidth}
                  width={pictureWidth}
                  fallback={
                    <Placeholder
                      color={spectrum.base3Content}
                      size={pictureWidth - 20}
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
              </View>
              <View
                style={{
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                  }}
                >
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
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    alignItems: "center",
    // backgroundColor: "cyan",
    flexDirection: "row",
    gap: 8,
    marginVertical: 8,
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
    // backgroundColor: "yellow",
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "black",
    flexDirection: "column",
    marginBottom: 16,
    width: screenWidthMinusPadding,
  },
  searchResultsTitle: {
    fontSize: 14,
    fontWeight: 500,
    paddingTop: 12,
  },
  locationContainer: {
    // borderBottomWidth: StyleSheet.hairlineWidth,
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
    // flex: 1,
    // flexShrink: 1,
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
});
