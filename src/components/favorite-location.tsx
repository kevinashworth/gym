import { ActivityIndicator, Pressable, Text, View } from "react-native";

import Icon from "@/components/icon";
import { useFavoriteLocation } from "@/hooks/useFavoriteLocation";
import { spectrum } from "@/theme";

interface FavoriteLocationProps {
  enableText?: boolean;
  referralCode?: string;
  uuid: string;
}

export default function FavoriteLocation({
  enableText = false,
  referralCode,
  uuid,
}: FavoriteLocationProps) {
  const { isFavorite, isUpdating, toggleFavorite } = useFavoriteLocation(uuid);

  const handleChange = () => {
    toggleFavorite();
  };

  return (
    <Pressable onPress={isUpdating ? undefined : handleChange}>
      <View style={{ alignItems: "center", flex: 1, flexDirection: "column", width: 64 }}>
        {isUpdating && (
          <ActivityIndicator
            color={spectrum.base3Content}
            size="small"
            style={{
              height: 24,
              width: 24,
            }}
          />
        )}
        {!isUpdating && (
          <>
            {isFavorite && (
              <Icon fill={spectrum.primary} name="heart" color={spectrum.primary} size={24} />
            )}
            {!isFavorite && <Icon name="heart" color={spectrum.secondary} size={24} />}
          </>
        )}
        {enableText && (
          <Text
            style={[
              { fontSize: 12, textAlign: "center" },
              {
                color: isUpdating
                  ? spectrum.base3Content
                  : isFavorite
                    ? spectrum.primary
                    : spectrum.secondary,
              },
            ]}>
            {isFavorite ? "Added" : "Add"} to Favorites
          </Text>
        )}
      </View>
    </Pressable>
  );
}
