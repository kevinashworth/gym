import { Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Icon from "@/components/icon";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";

const width = 150;

export default function DevSettings() {
  const {
    enableMockGeoLocation: enableMockLocation,
    showApiConsoleLogs,
    showDevToolbox,
    showPageInfo,
    showPathnameLog,
    toggleEnableMockGeoLocation,
    toggleShowApiConsoleLogs,
    toggleShowDevToolbox,
    toggleShowPageInfo,
    toggleShowPathnameLog,
  } = useDevStore();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Dev Settings",
        }}
      />
      <View style={styles.table}>
        <View style={styles.tableHead}>
          <Text style={styles.headerText}>Click icon to toggle</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { textAlign: "right", width }]} numberOfLines={1}>
            Use mock geo location
          </Text>
          <Pressable onPress={toggleEnableMockGeoLocation} style={styles.tableCell}>
            <Icon
              color={enableMockLocation ? spectrum.primary : spectrum.warning}
              name={enableMockLocation ? "square-check" : "square"}
              size={24}
            />
          </Pressable>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { textAlign: "right", width }]}>Dev toolbox</Text>
          <Pressable onPress={toggleShowDevToolbox} style={styles.tableCell}>
            <Icon
              color={showDevToolbox ? spectrum.primary : spectrum.warning}
              name={showDevToolbox ? "square-check" : "square"}
              size={24}
            />
          </Pressable>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { textAlign: "right", width }]}>Page info</Text>
          <Pressable onPress={toggleShowPageInfo} style={styles.tableCell}>
            <Icon
              color={showPageInfo ? spectrum.primary : spectrum.warning}
              name={showPageInfo ? "square-check" : "square"}
              size={24}
            />
          </Pressable>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { textAlign: "right", width }]}>API logs</Text>
          <Pressable onPress={toggleShowApiConsoleLogs} style={styles.tableCell}>
            <Icon
              color={showApiConsoleLogs ? spectrum.primary : spectrum.warning}
              name={showApiConsoleLogs ? "square-check" : "square"}
              size={24}
            />
          </Pressable>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { textAlign: "right", width }]}>Pathname log</Text>
          <Pressable onPress={toggleShowPathnameLog} style={styles.tableCell}>
            <Icon
              color={showPathnameLog ? spectrum.primary : spectrum.warning}
              name={showPathnameLog ? "square-check" : "square"}
              size={24}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 32,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 500,
    paddingBottom: 4,
  },
  table: {
    justifyContent: "center",
    padding: 8,
  },
  tableRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  tableCell: {},
  tableHead: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: spectrum.base1Content,
  },
});
