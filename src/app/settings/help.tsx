import { useState } from "react";

import { Stack } from "expo-router";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icon from "@/components/icon";
import InputWithClearButton from "@/components/input-with-clear-button";
import { spectrum } from "@/theme";

export default function Help() {
  const [filter, setFilter] = useState("");
  const handleClick = () => Linking.openURL("https://www.gotyou.co/faq-mobile");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Help" }} />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Icon color={spectrum.base1Content} name="search" size={24} style={styles.searchIcon} />
          <InputWithClearButton
            value={filter}
            onChangeText={(f) => setFilter(f)}
            placeholder="Search"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.styledGroup} onPress={handleClick}>
          <View style={styles.faqContent}>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>
                Frequently Asked Questions
              </Text>
              <Text style={styles.subtitle}>Tap to visit the FAQ page on our website</Text>
            </View>
            <View style={styles.iconContainer}>
              <Icon color={spectrum.base1Content} name="chevron-right" size={24} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const shadow = {
  boxShadow: "0 4px 5px rgba(0, 0, 0, 0.2)",
  elevation: 4,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    ...shadow,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 16,
  },
  styledGroup: {
    backgroundColor: "white",
    borderColor: spectrum.base2Content,
    borderRadius: 8,
    borderWidth: 1,
    ...shadow,
  },
  faqContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    color: spectrum.base1Content,
  },
  subtitle: {
    fontSize: 12,
    color: spectrum.base2Content,
  },
  iconContainer: {
    justifyContent: "center",
    marginLeft: 8,
  },
});
