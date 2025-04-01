import { useEffect } from "react";

import Checkbox from "expo-checkbox";
import { StyleSheet, Text, View } from "react-native";
import { useImmer } from "use-immer";

interface CheckboxGroupProps {
  disabled?: boolean;
  options: { label: string; value: string }[];
  onValueChange?: (value: string[]) => void;
  value?: string[];
}

function CheckboxGroup({ disabled, options }: CheckboxGroupProps) {
  const [isChecked, setChecked] = useImmer<{ [key: string]: { value: string; checked: boolean } }>(
    {}
  );

  useEffect(() => {
    const initializeChecked = () => {
      options.forEach((option) => {
        setChecked((draft) => {
          draft[option.label] = { value: option.value, checked: false };
        });
      });
    };

    initializeChecked();
  }, [options]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked[option.label].checked}
            // onValueChange={setChecked}
          />
          <Text style={styles.paragraph}>{option.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});

export default CheckboxGroup;
