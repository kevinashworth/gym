import { useEffect, useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import Button from "@/components/button";
import CheckboxGroup from "@/components/checkbox-group";

interface PromptWithAlternativesProps {
  alternatives: string[];
  onConfirm?: (value: string) => void;
  prompt: string;
  rightButtonLabel?: string;
  leftButtonLabel?: string;
  onLeftButtonPress?: () => void;
  onRightButtonPress?: () => void;
}

function PromptWithAlternatives({
  alternatives,
  onConfirm,
  prompt,
  rightButtonLabel,
  leftButtonLabel,
  onLeftButtonPress,
  onRightButtonPress,
}: PromptWithAlternativesProps) {
  const [selectedOptions, setSelectedOptions] = useState<boolean[]>([]);

  useEffect(() => {
    const initializeOptions = () => {
      const emptyFalseOptions = alternatives.map(() => false);
      setSelectedOptions(emptyFalseOptions);
    };
    initializeOptions();
  }, [alternatives]);

  const options = alternatives.map((alternative, index) => ({
    label: alternative,
    value: false,
  }));

  console.log(options, selectedOptions);

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{prompt}</Text>
      <CheckboxGroup alternatives={options} />
      <View style={{ flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 8 }}>
        {leftButtonLabel && onLeftButtonPress && (
          <Button onPress={onLeftButtonPress} label={leftButtonLabel} size="lg" variant="outline" />
        )}
        {rightButtonLabel && onRightButtonPress && (
          <Button
            onPress={onRightButtonPress}
            label={rightButtonLabel}
            size="lg"
            variant="outline"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  prompt: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 16,
    textAlign: "center",
  },
});

export default PromptWithAlternatives;
