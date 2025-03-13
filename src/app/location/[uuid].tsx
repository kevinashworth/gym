import React, { useState, useEffect } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
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
import { location, photoKeys } from "@/mocks/fixtures";
import { spectrum } from "@/theme";
import { clamp } from "@/utils/clamp";
import { phoneFormatter, phoneFormatterAsLink } from "@/utils/phone";

import type { Location } from "@/mocks/fixtures";

type ImageWithSize = {
  url: string;
  width: number;
  height: number;
};

type ImagesWithSize = ImageWithSize[];

const window = Dimensions.get("window");
const halfScreenWidthMinusPadding = window.width / 2 - 16;

const defaultSize = 164;
const defaultDimensions = { width: defaultSize, height: defaultSize };

function formatAddressForMaps(location: Location) {
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

  const [modalVisible, setModalVisible] = useState(false);

  const [imagesWithSizes, setImagesWithSizes] = useState<ImagesWithSize>([
    { url: "", width: 164, height: 164 },
  ]);

  const mainImage =
    location.business_logo || location.external_thumbnail_1 || "";
  const [mainImageWithSize, setMainImageWithSize] = useState<ImageWithSize>({
    ...defaultDimensions,
    url: mainImage,
  });

  const callNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) return;
    const url = phoneFormatterAsLink(phoneNumber);
    Linking.openURL(url).catch((e) => console.error(e));
  };

  const handleGoBack = () =>
    router.canGoBack() ? router.back() : router.replace("/(tabs)");

  useEffect(() => {
    const nonNullImages = photoKeys
      .filter((photo) => location[photo])
      .map((photo) => location[photo]);

    if (nonNullImages.length === 0) {
      setImagesWithSizes([]);
    } else if (nonNullImages.length > 0) {
      setImagesWithSizes([]);
      nonNullImages.forEach((photo) => {
        Image.getSize(photo, (width, height) => {
          const aspectRatio = clamp(0.75, width / height, 1.25);
          const w = halfScreenWidthMinusPadding;
          const h = halfScreenWidthMinusPadding / aspectRatio;
          setImagesWithSizes((prev) => [
            ...prev,
            { url: photo, width: w, height: h },
          ]);
        });
      });
    }
  }, []); // , [location]);

  useEffect(() => {
    if (mainImage) {
      Image.getSize(mainImage, (width, height) => {
        const aspectRatio = clamp(0.75, width / height, 1.25);
        const w = halfScreenWidthMinusPadding;
        const h = halfScreenWidthMinusPadding / aspectRatio;
        setMainImageWithSize({ url: mainImage, width: w, height: h });
      });
    }
  }, [mainImage]);

  const colWrap = Math.ceil(imagesWithSizes.length / 2);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Stack.Screen
          options={{
            header: () => <CustomHeader />,
          }}
        />
        <XStack style={styles.titleRow}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={32} color={spectrum.primary} />
          </TouchableOpacity>
          <Text style={styles.h3}>{location.name}</Text>
        </XStack>
        <ScrollView>
          {/* Y with top portion, down until images */}
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
                    uri: mainImageWithSize.url,
                  }}
                  height={mainImageWithSize.height}
                  width={mainImageWithSize.width}
                  fallback={
                    <Placeholder
                      color={spectrum.base3Content}
                      size={mainImageWithSize.width * 0.75}
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
                          address: formatAddressForMaps(location),
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
                          {location.address2 && (
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
                              {location.address2}
                            </Text>
                          )}
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
            {/* Y with 'Earn  Rewards' */}
            <YStack style={{ alignItems: "center", gap: 8 }}>
              <Text style={styles.h6}>Earn Rewards From This Business</Text>
              <CampaignActions />
            </YStack>
          </YStack>
          {/* View with images */}
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              padding: 8,
            }}
          >
            <View style={{ flex: 1, flexDirection: "column", gap: 6 }}>
              {imagesWithSizes.slice(0, colWrap).map((photo, i: number) => (
                <Image
                  key={i}
                  source={{ uri: photo.url }}
                  height={photo.height}
                  width={photo.width}
                  style={styles.image}
                />
              ))}
            </View>
            <View style={{ flex: 1, flexDirection: "column", gap: 6 }}>
              {imagesWithSizes.slice(colWrap).map((photo, i: number) => (
                <Pressable
                  key={i + colWrap}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Image
                    source={{ uri: photo.url }}
                    height={photo.height}
                    width={photo.width}
                    style={styles.image}
                  />
                </Pressable>
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
  address: {
    fontSize: 16,
    fontWeight: 500,
  },
  phone: {
    fontSize: 16,
    fontWeight: 400,
    marginLeft: -2, // I just eyeballed marginLeft to better offset the phone's opening parenthesis
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: spectrum.base2Content,
  },
  fallback: {
    backgroundColor: spectrum.gray5,
    borderRadius: 6,
  },
  image: {
    borderRadius: 6,
  },
});
