import { StyleSheet, View } from "react-native";

import RadioButton from "@/components/radio-button";

type RadioGroupProps = {
  disabled?: boolean;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  value?: string;
};

const RadioGroup = ({ disabled, options, onValueChange, value }: RadioGroupProps) => {
  const handlePress = (value: string) => {
    if (disabled) return;
    onValueChange(value);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <RadioButton
          disabled={disabled}
          key={option.value}
          label={option.label}
          value={option.value}
          selected={value === option.value}
          onPress={() => handlePress(option.value)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});

export default RadioGroup;
