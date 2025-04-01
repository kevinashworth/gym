import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { spectrum } from "@/theme";

interface RadioButtonProps {
  disabled?: boolean;
  label: string;
  labelStyle?: TextStyle;
  onPress: (value: string) => void;
  selected: boolean;
  style?: ViewStyle;
  value: string;
}

function RadioButton({
  disabled,
  label,
  labelStyle,
  onPress,
  selected,
  style,
  value,
}: RadioButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    onPress(value);
  };

  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={[styles.container, style]}>
        {selected ? (
          <Ionicons
            name="radio-button-on"
            size={20}
            color={disabled ? spectrum.base2Content : spectrum.primary}
          />
        ) : (
          <Ionicons
            name="radio-button-off"
            size={20}
            color={disabled ? spectrum.base2Content : spectrum.base1Content}
          />
        )}
        <Text style={[styles.label, labelStyle, { opacity: disabled ? 0.8 : 1 }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  label: {
    color: spectrum.base1Content,
    fontSize: 16,
    fontWeight: 400,
  },
});

export default RadioButton;
