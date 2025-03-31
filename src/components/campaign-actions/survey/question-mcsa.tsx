import { useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import Button from "@/components/button";
import RadioGroup from "@/components/radio-group";

interface PromptWithAlternativesProps {
  alternatives: string[];
  onConfirm?: () => void;
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
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

  const onSelect = (value: string) => {
    console.log(value);
    setSelectedOption(value);
  };

  const options = alternatives.map((alternative, index) => ({
    label: alternative,
    value: index.toString(),
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{prompt}</Text>
      <RadioGroup options={options} onValueChange={onSelect} value={selectedOption} />
      <View style={{ flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 8 }}>
        {/* <Button
          disabled={!selectedOption}
          onPress={() => setSelectedOption(undefined)}
          label="Clear"
          variant="outline"
          size="sm"
        /> */}
        {leftButtonLabel && onLeftButtonPress && (
          <Button
            disabled={!selectedOption}
            onPress={onLeftButtonPress}
            label={leftButtonLabel}
            size="lg"
            variant="outline"
          />
        )}
        {rightButtonLabel && onRightButtonPress && (
          <Button
            disabled={!selectedOption}
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default PromptWithAlternatives;
