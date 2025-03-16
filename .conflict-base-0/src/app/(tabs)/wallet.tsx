import Ionicons from "@expo/vector-icons/Ionicons";
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
import Icon from "@/components/icon";
import { data } from "@/mocks/fixtures";
import { spectrum } from "@/theme";

import type { IconName } from "@/components/icon";
import type { HistoryItem } from "@/mocks/fixtures";

const user_tag = "SillyUserTag";
const balanceStateLoading: boolean = false;

const me = {
  token_balance: {
    token_balance_get: 1000,
  },
};

const historyData = data?.pages.flatMap((p) => p.data.content);

const generateTypeIconValue = (
  item: HistoryItem,
): [string, IconName, number] => {
  if (item.type !== "transfer") {
    return [item.type, `Campaign${item.type}` as IconName, item.rewardGetToken];
  } else {
    if (item.actionDescription.indexOf("redeem") > -1) {
      return ["Redeem", "CircleDollarSign", -item.rewardGetToken];
    }
    const capitalizedStr =
      item.type.charAt(0).toUpperCase() + item.type.slice(1);
    return [capitalizedStr, capitalizedStr as IconName, -item.rewardGetToken]; // TODO: "as IconName" here is a lie. I mean, promise to fix it later.
  }
};

interface FlatListItemProps {
  index: number;
  item: any;
  onShowUnderlay: () => void;
  onHideUnderlay: () => void;
}

function FlatListItem({
  index,
  item,
  onShowUnderlay,
  onHideUnderlay,
}: FlatListItemProps) {
  const [type, icon, value] = generateTypeIconValue(item);

  return (
    <TouchableHighlight
      key={item.myId}
      underlayColor="#000"
      onShowUnderlay={onShowUnderlay}
      onHideUnderlay={onHideUnderlay}
    >
      <View style={styles.flatListItem}>
        <Icon size={20} color={spectrum.primary} name={icon} />
        <Text style={[styles.flatListItemText, { width: 72 }]}>
          {new Date(item.updateTimestamp).toLocaleDateString("en-US", {
            year: "2-digit",
            month: "numeric",
            day: "numeric",
          })}
        </Text>
        <Text
          style={[styles.flatListItemText, { flex: 1 }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {type === "Redeem" ? "Redeem" : item.location_name}
        </Text>
        <Text
          style={[
            styles.flatListItemText,
            { color: value > 0 ? "green" : "red", textAlign: "right" },
          ]}
        >
          {value > 0 && "+"}
          {value / 100}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

export default function WalletTab() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <View style={styles.headerWithIcon}>
            <Ionicons size={52} name="wallet" color={spectrum.base2Content} />
            <Text style={styles.h2}>Wallet</Text>
          </View>
          <Text style={styles.h2Secondary}>{user_tag}’s Tokens</Text>
        </View>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceIcon}>
            <BottomGet size={36} />
            <Text style={styles.balanceText}>GET</Text>
          </View>
          <View style={styles.balanceValue}>
            {balanceStateLoading === true && <ActivityIndicator />}
            {balanceStateLoading === false && (
              <Text style={styles.balanceText}>
                {new Intl.NumberFormat("en-US").format(
                  me.token_balance.token_balance_get,
                )}
              </Text>
            )}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.historyHeader}>
            <Text style={styles.h2}>History</Text>
          </View>
          <View style={styles.flatListContainer}>
            <FlatList
              data={historyData}
              initialNumToRender={10}
              keyExtractor={(item) => item.uuid}
              ItemSeparatorComponent={({ highlighted }) => (
                <View
                  style={[styles.separator, highlighted && { marginLeft: 0 }]}
                />
              )}
              ListEmptyComponent={
                <Empty
                  text="No transactions yet"
                  textProps={{ fontSize: 16 }}
                  vertical
                  style={{ marginTop: 20 }}
                />
              }
              ListFooterComponent={
                <Text style={styles.flatListFooter}>
                  You’ve reached the end of your wallet history
                </Text>
              }
              onEndReachedThreshold={0.2}
              renderItem={({ item, index, separators }) => (
                <FlatListItem
                  key={item.id}
                  item={item}
                  index={index}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}
                />
              )}
            />
          </View>

          {/* <ScrollView
          // flex={1}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
        <Stack width="100%" padding="$3" flex={1}>
          {status === 'pending' ? (
            <Spinner mt="$2" />
          ) : status === 'error' ? (
            <Text color="red5" textAlign="center">
              Failed to fetch data
            </Text>
          ) : !data ? (
            <Empty />
          ) : (
            <View>
              <FlatList
                data={historyData}
                initialNumToRender={10}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Empty />}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.2}
                onRefresh={refetch}
                refreshing={isRefetching}
                renderItem={renderItem}
              />
            </View>
          )}
        </Stack>
        </ScrollView> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: spectrum.base3Content,
  },
});
