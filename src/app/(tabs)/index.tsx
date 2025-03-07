import { Stack } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import Categories from "@/components/dashboard/categories";
import Communities from "@/components/dashboard/communities";
import Favorites from "@/components/dashboard/favorites";
import Suggested from "@/components/dashboard/suggested";
import { spectrum } from "@/theme";

export default function DashboardTab() {
  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <View>
          <Text style={styles.heading}>Favorites</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Favorites />
          </ScrollView>
        </View>
        <View>
          <Text style={styles.heading}>Suggested Near Me</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Suggested />
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
        <Text style={styles.text}>
          src/app/(tabs)/index.tsx
        </Text>
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
  text: {
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
