import React from "react";

import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { HandHelping, HeartPulse, ShoppingBasket, Soup, Store } from "lucide-react-native";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import Empty from "@/components/empty";
import ErrorMessage from "@/components/error-message";
import api from "@/lib/api";
import { spectrum } from "@/theme";

import type { LucideIcon } from "lucide-react-native";

// This is just the list of categories we expect from the API
export type Category = "convenience" | "health" | "restaurants" | "retail" | "services";

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
  const {
    data: categories,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["dashboard", "categories"],
    queryFn: () => api.get<Category[]>("user/location/categories").json(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  if (isFetching) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator size="large" color={spectrum.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <ErrorMessage error={error} />
      </View>
    );
  }

  if (!categories?.length) {
    return (
      <View style={styles.messageContainer}>
        <Empty />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <Link href={`/category/${category}`} asChild key={category}>
          <Pressable>
            <View style={styles.favoriteContainer}>
              <LinearGradient
                colors={[spectrum.secondary, spectrum.primary]}
                locations={[0, 0.8]}
                style={styles.gradient}>
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
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    color: spectrum.base1Content,
    fontSize: 16,
  },
});
