import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { spectrum } from "@/theme";

interface NotificationItemProps {
  color?: string;
  title: string;
  subtitle?: string;
}

export default function NotificationItem({
  color = spectrum.primary,
  title,
  subtitle,
}: NotificationItemProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.colorBar, { backgroundColor: color }]} />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons color={spectrum.base2Content} name="trash" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: spectrum.base2Content,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    height: 70,
    overflow: "hidden",
  },
  colorBar: {
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    width: 16,
  },
  content: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
  },
});
