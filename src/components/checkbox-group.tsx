// import { useState } from "react";

import Checkbox from "expo-checkbox";
import { StyleSheet, Text, View } from "react-native";
import { useImmer } from "use-immer";

import { spectrum } from "@/theme";

import type { CheckboxProps } from "expo-checkbox";

interface MyCheckboxProps extends CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

function MyCheckbox({ label, checked, onPress, ...rest }: MyCheckboxProps) {
  return (
    <View style={styles.section}>
      <Checkbox value={checked} onValueChange={onPress} {...rest} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

interface CheckboxGroupProps {
  alternatives: { label: string; value: boolean }[];
}

function CheckboxGroup({ alternatives }: CheckboxGroupProps) {
  const [checkedValues, setCheckedValues] = useImmer(alternatives.map((_) => false));

  const handleCheckboxPress = ({ index }: { index: number }) => {
    setCheckedValues((draft) => {
      draft[index] = !draft[index];
    });
  };

  return (
    <View style={styles.container}>
      {alternatives.map((item, index) => (
        <MyCheckbox
          key={item.label}
          label={item.label}
          checked={checkedValues[index]}
          onPress={() => handleCheckboxPress({ index })}
          style={styles.checkbox}
          color={checkedValues[index] ? spectrum.primary : spectrum.base1Content}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 16,
    // marginVertical: 32,
    // backgroundColor: "red",
  },
  section: {
    // backgroundColor: "orange",
    flexDirection: "row",
    alignItems: "center",
    // height: 40,
  },
  label: {
    color: spectrum.base1Content,
    fontSize: 16,
    fontWeight: 400,
  },
  checkbox: {
    margin: 8,
  },
});

export default CheckboxGroup;
