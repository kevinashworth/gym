import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import {
  HandHelping,
  HeartPulse,
  ShoppingBasket,
  Soup,
  Store,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { categories } from "@/mocks/fixtures";
import { spectrum } from "@/theme";

import type { Category } from "@/mocks/fixtures";
import type { LucideIcon } from "lucide-react-native";

const IconComponent: Record<Category, LucideIcon> = {
  convenience: ShoppingBasket,
  health: HeartPulse,
  restaurants: Soup,
  retail: Store,
  services: HandHelping,
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCategoryIcon(category: Category) {
  return React.createElement(IconComponent[category], {
    color: "white",
    size: 40,
    strokeWidth: 1.5,
  });
}

export default function Categories() {
  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <Link href="/" asChild key={category}>
          <Pressable>
            <View style={styles.favoriteContainer}>
              <LinearGradient
                colors={[spectrum.secondary, spectrum.primary]}
                locations={[0, 0.8]}
                style={styles.gradient}
              >
                {getCategoryIcon(category)}
              </LinearGradient>
              <Text style={styles.text}>{capitalize(category)}</Text>
            </View>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  favoriteContainer: {
    flex: 1,
    alignItems: "center",
  },
  gradient: {
    flex: 1,
    borderRadius: 4,
    padding: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
    wordWrap: "break-word",
  },
});
