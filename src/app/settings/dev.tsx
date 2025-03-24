import React from "react";

import { Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Icon from "@/components/icon";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";

export default function DevSettings() {
  const {
    showApiConsoleLogs,
    showDevToolbox,
    showPageInfo,
    showPathnameLog,
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
          <Text>Click to toggle</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: 108 }]}>Dev Toolbox</Text>
          <Pressable onPress={toggleShowDevToolbox} style={styles.tableCell}>
            <Icon
              color={showDevToolbox ? spectrum.primary : spectrum.warning}
              name={showDevToolbox ? "check-square-o" : "square-o"}
              size={24}
            />
          </Pressable>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: 108 }]}>Page info</Text>
          <Pressable onPress={toggleShowPageInfo} style={styles.tableCell}>
            <Icon
              color={showPageInfo ? spectrum.primary : spectrum.warning}
              name={showPageInfo ? "check-square-o" : "square-o"}
              size={24}
            />
          </Pressable>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: 108 }]}>API logs</Text>
          <Pressable
            onPress={toggleShowApiConsoleLogs}
            style={styles.tableCell}
          >
            <Icon
              color={showApiConsoleLogs ? spectrum.primary : spectrum.warning}
              name={showApiConsoleLogs ? "check-square-o" : "square-o"}
              size={24}
            />
          </Pressable>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: 108 }]}>Pathname log</Text>
          <Pressable onPress={toggleShowPathnameLog} style={styles.tableCell}>
            <Icon
              color={showPathnameLog ? spectrum.primary : spectrum.warning}
              name={showPathnameLog ? "check-square-o" : "square-o"}
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
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  table: {
    justifyContent: "center",
    margin: 8,
    width: 200,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  tableCell: {
    color: "black",
    paddingEnd: 8,
    textAlign: "center",
  },
  tableHead: {
    justifyContent: "center",
    alignItems: "center",
  },
});
