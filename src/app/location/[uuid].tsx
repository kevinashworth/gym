import React, { useState, useEffect } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import {
  // Link,
  Stack,
  useGlobalSearchParams,
  // useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { showLocation } from "react-native-map-link";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Placeholder from "@/assets/svg/placeholder";
import CampaignActions from "@/components/campaign-actions";
import FavoriteLocation from "@/components/favorite-location";
import CustomHeader from "@/components/header";
import Picture from "@/components/picture";
import XStack from "@/components/x-stack";
import YStack from "@/components/y-stack";
import { location, photos } from "@/mocks/fixtures";
import { spectrum } from "@/theme";
import { clamp } from "@/utils/clamp";
import { phoneFormatter, phoneFormatterAsLink } from "@/utils/phone";

import type { Location } from "@/mocks/fixtures";

type ImageWithSizes = {
  photo: string;
  width: number;
  height: number;
};

const window = Dimensions.get("window");
const halfScreenWidthMinusPadding = window.width / 2 - 16;

function formattedAddress(location: Location) {
  return (
    location.address1 +
    (location.address2 ? ` ${location.address2}, ` : " ") +
    location.city +
    ", " +
    location.state +
    " " +
    location.zip
  );
}

export default function LocationScreen() {
  const router = useRouter();
  const { uuid } = useGlobalSearchParams<{ uuid: string }>();

  const [imagesWithSizes, setImagesWithSizes] = useState<ImageWithSizes[]>([
    { photo: "", width: 164, height: 164 },
  ]);

  const [mainImageWithSizes, setMainImageWithSizes] = useState<ImageWithSizes>({
    photo: "",
    width: 164,
    height: 164,
  });

  const callNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) return;
    const url = phoneFormatterAsLink(phoneNumber);
    Linking.openURL(url).catch((e) => console.error(e));
  };

  const handleGoBack = () =>
    router.canGoBack() ? router.back() : router.replace("/(tabs)");

  useEffect(() => {
    const nonNullImages = photos
      .filter((photo) => location[photo])
      .map((photo) => location[photo]);
    setImagesWithSizes([]);
    nonNullImages.forEach((photo) => {
      Image.getSize(photo, (width, height) => {
        const aspectRatio = clamp(0.75, width / height, 1.25);
        // let w = width;
        // let h = height;
        const w = halfScreenWidthMinusPadding;
        const h = halfScreenWidthMinusPadding / aspectRatio;
        setImagesWithSizes((prev) => [...prev, { photo, width: w, height: h }]);
      });
    });
  }, []);

  useEffect(() => {
    setMainImageWithSizes({ photo: "", width: 164, height: 164 });
    const mainImage = location.business_logo || location.external_thumbnail_1;
    if (!mainImage) return;
    Image.getSize(mainImage, (width, height) => {
      const aspectRatio = clamp(0.75, width / height, 1.25);
      // let w = width;
      // let h = height;
      const w = halfScreenWidthMinusPadding;
      const h = halfScreenWidthMinusPadding / aspectRatio;
      setMainImageWithSizes({ photo: mainImage, width: w, height: h });
    });
  }, []);

  console.log("mainImageWithSizes", mainImageWithSizes);

  const colWrap = Math.ceil(imagesWithSizes.length / 2);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView>
          <Stack.Screen
            options={{
              // headerShown: false,
              // animation: "slide_from_right",
              header: () => <CustomHeader />,
            }}
          />
          {/* X with Title Row */}
          <XStack style={styles.titleRow}>
            <TouchableOpacity onPress={handleGoBack}>
              <Ionicons
                name="chevron-back"
                size={32}
                color={spectrum.primary}
              />
            </TouchableOpacity>
            <Text style={styles.h3}>{location.name}</Text>
          </XStack>
          {/* Y with rest of screen */}
          <YStack style={{ paddingHorizontal: 16 }}>
            {/* Y with basic business info */}
            <YStack>
              {/* X with picture and review score */}
              <XStack
                style={{
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Picture
                  source={{
                    uri: mainImageWithSizes.photo,
                  }}
                  height={mainImageWithSizes.height}
                  width={mainImageWithSizes.width}
                  fallback={
                    <Placeholder
                      color={spectrum.base3Content}
                      size={mainImageWithSizes.width * 0.75}
                    />
                  }
                  fallbackStyle={styles.fallback}
                  imageStyle={styles.image}
                />
                <YStack>
                  <XStack style={{ gap: 2 }}>
                    <Text>Review Score:</Text>
                    <Text style={{ fontWeight: 500 }}>
                      {location.average_rating
                        ? Number(location.average_rating).toFixed(1)
                        : "—"}
                    </Text>
                  </XStack>
                </YStack>
              </XStack>
              <YStack>
                <XStack style={{ paddingVertical: 8 }}>
                  <YStack>
                    <Pressable
                      onPress={() =>
                        showLocation({
                          address: formattedAddress(location),
                        })
                      }
                    >
                      {({ pressed }) => (
                        <>
                          <Text
                            style={[
                              styles.address,
                              {
                                textDecorationLine: pressed
                                  ? "underline"
                                  : "none",
                              },
                            ]}
                          >
                            {location.address1}
                          </Text>
                          <Text
                            style={[
                              styles.address,
                              {
                                textDecorationLine: pressed
                                  ? "underline"
                                  : "none",
                              },
                            ]}
                          >
                            {location.city} {location.state} {location.zip}
                          </Text>
                        </>
                      )}
                    </Pressable>
                    <TouchableOpacity
                      onPress={() => callNumber(location.business_phone)}
                    >
                      <Text style={styles.phone}>
                        {phoneFormatter(location.business_phone)}
                      </Text>
                    </TouchableOpacity>
                  </YStack>
                  <FavoriteLocation uuid={uuid} enableText />
                </XStack>
                <Text style={styles.description}>
                  {location.description || "(No description)"}
                </Text>
              </YStack>
            </YStack>

            {/* Y with 'earnrewards' then pictures */}
            <YStack style={{ alignItems: "center", gap: 8 }}>
              <Text style={styles.h6}>Earn Rewards From This Business</Text>
              <CampaignActions />
            </YStack>
          </YStack>

          <View
            style={{
              flexDirection: "row",
              gap: 6,
              padding: 12,
            }}
          >
            <View style={{ flex: 1, flexDirection: "column", gap: 6 }}>
              {imagesWithSizes.slice(0, colWrap).map((photo, i: number) => (
                <Image
                  key={i}
                  source={{ uri: photo.photo }}
                  height={photo.height}
                  width={photo.width}
                  style={styles.image}
                />
              ))}
            </View>
            <View style={{ flex: 1, flexDirection: "column", gap: 6 }}>
              {imagesWithSizes.slice(colWrap).map((photo, i: number) => (
                <Image
                  key={i + colWrap}
                  source={{ uri: photo.photo }}
                  height={photo.height}
                  width={photo.width}
                  style={styles.image}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
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
  h6: {
    color: spectrum.base1Content,
    fontSize: 16,
    fontWeight: 400,
  },
  contentContainer: {
    backgroundColor: "gainsboro",
    flexDirection: "row",
    paddingHorizontal: 20,
    width: "100%",
  },
  infoContainer: {
    alignItems: "center",
    backgroundColor: "lightcyan",
    marginTop: 20,
  },
  reviewScore: {
    fontSize: 12,
    fontWeight: 500,
  },
  address: {
    fontSize: 16,
    fontWeight: 500,
  },
  phone: {
    fontSize: 16,
    fontWeight: 400,
    marginLeft: -2, // {/* I just eyeballed the marginLeft={-2} offset for opening parenthesis. */}
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: spectrum.base2Content,
  },
  imagesContainer: {
    backgroundColor: "yellow",
    alignItems: "flex-start",
    flexDirection: "row",
    // gap: 6,
    justifyContent: "center",
    marginTop: 20,
    // width: fullScreenWidthMinusPadding,
  },
  imagesInnerContainer: {
    backgroundColor: "cyan",
    alignItems: "center",
    flex: 1,
    // justifyContent: "flex-start",
    gap: 6,
  },
  fallback: {
    backgroundColor: spectrum.gray5,
    borderRadius: 6,
    // width: halfScreenWidthMinusPadding,
    // height: halfScreenWidthMinusPadding,
  },
  image: {
    // backgroundColor: "green",
    borderRadius: 6,
  },
});
