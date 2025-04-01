import { useLayoutEffect, useRef, useState } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from "react-native";

import BottomGet from "@/assets/svg/bottom-get";
import Empty from "@/components/empty";
import ErrorMessage from "@/components/error-message";
import Icon from "@/components/icon";
import api from "@/lib/api";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";

import type { HistoryIconName, IconName } from "@/components/icon";
import type { Balance, History, HistoryItem } from "@/types/wallet";

const generateTypeIconValue = (item: HistoryItem): [string, IconName, number] => {
  if (item.type !== "transfer") {
    // The 5 possible values for item.type are "CheckIn", "CheckInQRCode",
    // "Referral", "Review", "Survey".
    const iconName: HistoryIconName = `Campaign${item.type}`;
    return [item.type, iconName, item.rewardGetToken];
  } else {
    if (item.actionDescription.indexOf("redeem") > -1) {
      return ["Redeem", "circle-dollar-sign", -item.rewardGetToken];
    }
    const capitalizedStr = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    // NB: "as IconName" below is a promise with no guarantee. But it won't
    // break anything and it's not a big deal and it should only come into play
    // if the backend changes and we don't update the new values here in the
    // mobile app.
    // TODO: Fix this later? Is there a possible fix?
    return [capitalizedStr, capitalizedStr as IconName, -item.rewardGetToken];
  }
};

interface FlatListItemProps {
  item: HistoryItem;
  onShowUnderlay: () => void;
  onHideUnderlay: () => void;
}

function FlatListItem({ item, onShowUnderlay, onHideUnderlay }: FlatListItemProps) {
  const [type, icon, value] = generateTypeIconValue(item);

  return (
    <TouchableHighlight
      key={item.uuid}
      underlayColor="#000"
      onShowUnderlay={onShowUnderlay}
      onHideUnderlay={onHideUnderlay}>
      <View style={styles.flatListItem}>
        <Icon size={20} color={spectrum.primary} name={icon} />
        <Text
          style={[styles.flatListItemText, { width: 72 }]}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {new Date(item.updateTimestamp).toLocaleDateString("en-US", {
            year: "2-digit",
            month: "numeric",
            day: "numeric",
          })}
        </Text>
        <Text style={[styles.flatListItemText, { flex: 1 }]} numberOfLines={1} adjustsFontSizeToFit>
          {type === "Redeem" ? "Redeem" : item.location_name}
        </Text>
        <Text
          style={[
            styles.flatListItemText,
            { color: value > 0 ? "green" : "red", textAlign: "right" },
          ]}>
          {value > 0 && "+"}
          {value / 100}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

export default function WalletTab() {
  const showPageInfo = useDevStore((s) => s.showPageInfo);

  const [size, setSize] = useState(0);
  const targetRef = useRef<View>(null);

  const fetchHistory = async ({ pageParam = 0 }: { pageParam?: number }) => {
    return api
      .get<History>("user/history", {
        searchParams: { page: pageParam, size },
      })
      .json();
  };

  const { data, error, fetchNextPage, hasNextPage, isError, isLoading, isRefetching, refetch } =
    useInfiniteQuery({
      enabled: size > 0,
      queryKey: ["wallet", "istory", { pageSize: size }],
      queryFn: fetchHistory,
      placeholderData: keepPreviousData,
      initialPageParam: 0,
      getNextPageParam: ({ last, pageable: { pageNumber } }) => (last ? undefined : pageNumber + 1),
      getPreviousPageParam: ({ first, pageable: { pageNumber } }) =>
        first ? undefined : pageNumber - 1,
    });

  const balanceQuery = useQuery({
    queryKey: ["user", "balance"],
    queryFn: () => api.get<Balance>("user/balance").json(),
  });

  const historyData = data?.pages.flatMap((group) => group.content);

  useLayoutEffect(() => {
    const heightFlatListItem = 38; // TODO: Make this dynamic? Or just use a const?
    targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
      const heightOfFlatListContainer = height;
      const numberOfItemsForAvailableHeight = Math.max(
        10,
        Math.ceil(heightOfFlatListContainer / heightFlatListItem) + 1
      );
      setSize(numberOfItemsForAvailableHeight);
    });
  }, [targetRef]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <View style={styles.headerWithIcon}>
          <Ionicons size={52} name="wallet" color={spectrum.base2Content} />
          <Text style={styles.h2}>Wallet</Text>
        </View>
        <Text style={styles.h2Secondary}>Your Tokens</Text>
      </View>
      <View style={styles.balanceContainer}>
        <View style={styles.balanceIcon}>
          <BottomGet size={36} />
          <Text style={styles.balanceText}>GET</Text>
        </View>
        <View style={styles.balanceValue}>
          {balanceQuery.isLoading && <ActivityIndicator />}
          {balanceQuery.isSuccess && (
            <Text style={styles.balanceText}>
              {new Intl.NumberFormat("en-US").format(
                balanceQuery.data?.token_balance.token_balance_get
              )}
            </Text>
          )}
          {balanceQuery.isError && (
            <ErrorMessage
              error={balanceQuery.error}
              adjustsFontSizeToFit={true}
              numberOfLines={2}
              ellipsizeMode="clip"
              style={{ textAlign: "right" }}
            />
          )}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.historyHeader}>
          <Text style={styles.h2}>History</Text>
        </View>
        <View style={styles.flatListContainer} ref={targetRef}>
          {isLoading ? (
            <View style={styles.errorAndLoadingContainer}>
              <ActivityIndicator color={spectrum.primary} size="large" />
            </View>
          ) : isError ? (
            <View style={styles.errorAndLoadingContainer}>
              <ErrorMessage error={error} size="large" />
            </View>
          ) : (
            <FlatList
              data={historyData}
              initialNumToRender={size}
              keyExtractor={(item) => item.uuid}
              ItemSeparatorComponent={({ highlighted }) => (
                <View style={[styles.flatListSeparator, highlighted && { marginLeft: 0 }]} />
              )}
              ListEmptyComponent={
                <Empty
                  style={{ marginTop: 20 }}
                  text="No transactions yet"
                  textStyle={{ fontSize: 16 }}
                  vertical
                />
              }
              ListFooterComponent={
                <>
                  {hasNextPage ? (
                    <ActivityIndicator color={spectrum.primary} size="large" />
                  ) : (
                    <Text style={styles.flatListFooter}>
                      You’ve reached the end of your wallet history
                    </Text>
                  )}
                  {showPageInfo && <Text style={styles.pageInfo}>src/app/(tabs)/wallet.tsx</Text>}
                </>
              }
              onEndReached={() => fetchNextPage()}
              onEndReachedThreshold={0.2}
              onRefresh={refetch}
              refreshing={isRefetching}
              renderItem={({ item, separators }) => (
                <FlatListItem
                  key={item.uuid}
                  item={item}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}
                />
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorAndLoadingContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  header: {
    alignItems: "center",
    flex: 0,
    gap: 4,
    padding: 4,
  },
  headerWithIcon: {
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
  },
  h2: {
    color: spectrum.base2Content,
    fontSize: 28,
    fontWeight: 500,
  },
  h2Secondary: {
    color: spectrum.base1Content,
    fontSize: 13,
    fontWeight: 300,
    marginBottom: 8,
  },
  historyHeader: {
    borderColor: spectrum.gray8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  balanceContainer: {
    alignItems: "center",
    borderColor: spectrum.gray8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 22,
    paddingVertical: 2,
  },
  balanceIcon: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  balanceValue: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  balanceText: {
    color: spectrum.base1Content,
    fontSize: 20,
    fontWeight: 500,
  },
  flatListContainer: {
    flex: 1,
    margin: 8,
    marginTop: 0,
  },
  flatListItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  flatListItemText: {
    color: spectrum.base1Content,
    fontSize: 18,
    fontWeight: 400,
  },
  flatListFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: spectrum.base3Content,
    color: spectrum.base2Content,
    fontSize: 12,
    fontWeight: 300,
    paddingVertical: 12,
    textAlign: "center",
  },
  flatListSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: spectrum.base3Content,
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
