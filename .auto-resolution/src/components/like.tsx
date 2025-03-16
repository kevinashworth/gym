import React, { useState, useEffect } from "react";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  Text,
} from "react-native";

import YStack from "@/components/y-stack";
import { NOOP } from "@/constants/constants";
import { spectrum } from "@/theme";

// Like is a clickable heart icon that adds a merchant to user's Favorites, or
// removes it from Favorites.
// A loading spinner shows when heart is clicked and state is updating.

interface LikeProps {
  enableText?: boolean;
  liked?: boolean;
  loading?: boolean;
  onChange?: (value: boolean) => void;
}

export default function Like({
  enableText = false,
  liked = false,
  loading = false,
  onChange = NOOP,
}: LikeProps) {
  const [currentValue, setCurrentValue] = useState(liked);

  useEffect(() => {
    if (liked !== currentValue) {
      setCurrentValue(liked);
    }
  }, [currentValue, liked]);

  const handleChange = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (loading) return;
    setCurrentValue(!currentValue);
    onChange(!currentValue);
  };

  return (
    <Pressable onPress={handleChange}>
      <YStack style={{ alignItems: "center", width: 64 }}>
        {loading && (
          <ActivityIndicator
            size="small"
            style={{
              height: 24,
              width: 24,
            }}
          />
        )}
        {!loading && (
          <>
            {currentValue && (
              <FontAwesome name="heart" color={spectrum.primary} size={24} />
            )}
            {!currentValue && (
              <FontAwesome
                name="heart-o"
                color={spectrum.secondary}
                size={24}
              />
            )}
          </>
        )}
        {enableText && (
          <Text
            style={[
              { fontSize: 12, textAlign: "center" },
              {
                color: loading
                  ? spectrum.base3Content
                  : currentValue
                    ? spectrum.primary
                    : spectrum.secondary,
              },
            ]}
          >
            {currentValue ? "Added" : "Add"} to Favorites
          </Text>
        )}
      </YStack>
    </Pressable>
  );
}
