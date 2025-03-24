import React, { useEffect, useState } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
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

import Placeholder from "@/assets/svg/placeholder";
import CampaignActions from "@/components/campaign-actions";
import DisplayJSON from "@/components/display-json";
import ErrorMessage from "@/components/error-message";
import FavoriteLocation from "@/components/favorite-location";
import CustomHeader from "@/components/header";
import Picture from "@/components/picture";
import XStack from "@/components/x-stack";
import YStack from "@/components/y-stack";
import { photoKeys } from "@/constants/photoKeys";
import api from "@/lib/api";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";
import { clamp } from "@/utils/clamp";
import { formatAddressForMaps } from "@/utils/maps";
import { phoneFormatter, phoneFormatterAsLink } from "@/utils/phone";

import type { Location } from "@/types/location";

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

export default function LocationScreen() {
  const params = useLocalSearchParams();
  const uuid = params.uuid as string;
  const router = useRouter();
  const showDevToolbox = useDevStore((s) => s.showDevToolbox);
  const [colWrap, setColWrap] = useState(0);
  const [imagesWithSizes, setImagesWithSizes] = useState<ImagesWithSize>([]);
  const [mainImageWithSize, setMainImageWithSize] = useState<ImageWithSize>({
    ...defaultDimensions,
    url: "",
  });

  const {
    data: location,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["location", uuid],
    queryFn: () => api.get<Location>(`user/location/${uuid}`).json(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (!location) return;
    const nonNullImages = photoKeys
      .filter((photo) => location[photo as keyof Location])
      .map((photo) => location[photo as keyof Location] as string);

    if (nonNullImages.length === 0) {
      setImagesWithSizes([]);
    } else if (nonNullImages.length > 0) {
      const images: ImagesWithSize = [];
      nonNullImages.forEach((photo) => {
        Image.getSize(photo, (width, height) => {
          const aspectRatio = clamp(0.75, width / height, 1.25);
          const w = halfScreenWidthMinusPadding;
          const h = halfScreenWidthMinusPadding / aspectRatio;
          images.push({ url: photo, width: w, height: h });
          if (images.length === nonNullImages.length) {
            setImagesWithSizes(images);
          }
        });
      });
    }
  }, [location]);

  useEffect(() => {
    if (!location) return;
    const mainImage =
      location.business_logo || location.external_thumbnail_1 || "";
    if (mainImage) {
      Image.getSize(mainImage, (width, height) => {
        const aspectRatio = clamp(0.75, width / height, 1.25);
        const w = halfScreenWidthMinusPadding;
        const h = halfScreenWidthMinusPadding / aspectRatio;
        setMainImageWithSize({ url: mainImage, width: w, height: h });
      });
    }
  }, [location]);

  useEffect(() => {
    setColWrap(Math.ceil(imagesWithSizes.length / 2));
  }, [imagesWithSizes]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Stack.Screen
          options={{
            header: () => <CustomHeader />,
          }}
        />
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

  if (!location) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ErrorMessage error="Location not found" />
      </View>
    );
  }

  const callNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) return;
    const url = phoneFormatterAsLink(phoneNumber);
    Linking.openURL(url).catch((e) => console.error(e));
  };

  const handleGoBack = () =>
    router.canGoBack() ? router.back() : router.replace("/(tabs)");

  return (
    <View style={styles.container}>
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
        <YStack style={{ paddingHorizontal: 16 }}>
          <YStack>
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
                      {phoneFormatter(location.business_phone || "")}
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
          <YStack style={{ alignItems: "center", gap: 8 }}>
            <Text style={styles.h6}>Earn Rewards From This Business</Text>
            <CampaignActions />
          </YStack>
        </YStack>
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
                key={photo.url + i}
                source={{ uri: photo.url }}
                height={photo.height}
                width={photo.width}
                style={styles.image}
              />
            ))}
          </View>
          <View style={{ flex: 1, flexDirection: "column", gap: 6 }}>
            {imagesWithSizes.slice(colWrap).map((photo, i: number) => (
              <Image
                key={photo.url + i + colWrap}
                source={{ uri: photo.url }}
                height={photo.height}
                width={photo.width}
                style={styles.image}
              />
            ))}
          </View>
        </View>
        {showDevToolbox && (
          <View style={styles.toolbox}>
            <Text style={styles.toolboxHeader}>Dev Toolbox</Text>
            <DisplayJSON json={{ imagesWithSizes }} />
          </View>
        )}
      </ScrollView>
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
  toolbox: {
    backgroundColor: spectrum.gray1,
    borderColor: spectrum.gray8,
    borderWidth: 2,
    borderRadius: 8,
    gap: 8,
    marginVertical: 8,
    padding: 8,
  },
  toolboxButton: {
    borderColor: spectrum.gray8,
    borderWidth: 2,
    borderRadius: 8,
  },
  toolboxHeader: {
    color: spectrum.primaryLight,
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
  },
});
