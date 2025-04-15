import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import IconCoins from "@/assets/svg/icon-coins";
import Icon from "@/components/icon";
import { spectrum } from "@/theme";

interface CampaignButtonProps {
  coins?: number;
  disabled?: boolean;
  iconName: "CampaignCheckIn" | "CampaignReferral" | "CampaignReview" | "CampaignSurvey";
  label: string;
  onPress: () => void;
}

export default function CampaignButton({
  disabled = false,
  coins,
  iconName,
  label,
  onPress,
}: CampaignButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, disabled && styles.containerDisabled]}>
      <View style={styles.button}>
        <Icon
          color={disabled ? spectrum.base2Content : spectrum.primary}
          name={iconName}
          size={14}
        />
        <Text style={[styles.buttonLabel, disabled && styles.buttonLabelDisabled]}>{label}</Text>
        {coins && <IconCoins quantity={coins} size={16} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: spectrum.base1,
    borderColor: spectrum.primary,
    borderRadius: 18,
    borderWidth: 1,
    padding: 4,
    width: 160,
  },
  containerDisabled: {
    borderColor: spectrum.base2Content,
    opacity: 0.8,
  },
  button: {
    alignItems: "center",
    backgroundColor: spectrum.white,
    flexDirection: "row",
    gap: 8,
  },
  buttonLabel: {
    color: spectrum.primary,
    fontSize: 14,
    fontWeight: 500,
  },
  buttonLabelDisabled: {
    color: spectrum.base2Content,
  },
});
