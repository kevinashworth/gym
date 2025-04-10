import { useCallback, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Stack, useFocusEffect } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "@/components/button";
import Categories from "@/components/dashboard/categories";
import Communities from "@/components/dashboard/communities";
import Favorites from "@/components/dashboard/favorites";
import Suggested from "@/components/dashboard/suggested";
import Dialog from "@/components/dialog";
import Icon from "@/components/icon";
import { useGeoLocation } from "@/context/location";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";

export default function DashboardTab() {
  const { lat, lng, refreshGeoLocation, retryGeoLocationPermission, isRequesting } =
    useGeoLocation();
  const showPageInfo = useDevStore((state) => state.showPageInfo);
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);
  const [showLocationPermissionDialog, setShowLocationPermissionDialog] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (lat === undefined || lng === undefined) {
        setShowLocationPermissionDialog(true);
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }, [lat, lng, setShowLocationPermissionDialog])
  );

  // Refetch Favorites, Suggested, Categories when user pulls down to refresh
  // TODO: Also useFocusEffect to refetch when returning from, say, Settings?
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    queryClient
      .refetchQueries({
        queryKey: ["dashboard"],
        type: "active",
      })
      .then(() => {
        setRefreshing(false);
      });
  }, [queryClient]);

  // useFocusEffect(
  //   useCallback(() => {
  //     queryClient.refetchQueries({
  //       queryKey: ["dashboard"],
  //       type: "active",
  //     });
  //   }, [queryClient]),
  // );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={refreshing}
          tintColor={spectrum.primary}
        />
      }>
      <Stack.Screen options={{ headerShown: false }} />
      <Dialog
        isVisible={showLocationPermissionDialog}
        onHide={() => setShowLocationPermissionDialog(false)}>
        <Icon name="octagon-alert" size={32} color={spectrum.error} />
        <Text style={styles.locationPermissionText}>
          To find favorite stores near you, or to suggest stores you might like, we need permission
          to access your location. Most of the GotYou app will not work very well without those
          permissions, so grant them, already!
        </Text>
        <Text style={styles.locationPermissionText}>
          Go to{" "}
          <Text style={{ fontWeight: 700 }}>
            Settings &gt; Privacy &gt; Location Services &gt; GotYou
          </Text>
          , toggle permissions to Allow, and then come back here and click this{" "}
          <Text style={{ fontWeight: 700 }}>Allow Location Permission</Text> button.
        </Text>
        <Button
          activityIndicator={isRequesting}
          activityIndicatorProps={{ color: spectrum.primary, size: "small" }}
          label="Allow Location Permission"
          onPress={retryGeoLocationPermission}
        />
      </Dialog>
      <View style={styles.container}>
        <View>
          <Text style={styles.heading}>Favorites</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Favorites disabled={disabled} />
          </ScrollView>
        </View>
        <View>
          <Text style={[styles.heading, { marginBottom: 6 }]}>Suggested Near Me</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Suggested disabled={disabled} />
          </ScrollView>
        </View>
        <View>
          <Text style={styles.heading}>Categories</Text>
          <Categories />
        </View>
        <View>
          <Text style={styles.heading}>Communities - Coming Soon</Text>
          <Communities />
        </View>
        {showPageInfo && <Text style={styles.pageInfo}>src/app/(tabs)/index.tsx</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    gap: 16,
  },
  heading: {
    fontSize: 17,
    fontWeight: 500,
    marginVertical: 12,
    textTransform: "uppercase",
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
  locationPermissionText: {
    fontSize: 14,
    marginVertical: 12,
    color: spectrum.base1Content,
  },
});
