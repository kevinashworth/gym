import React, { forwardRef } from "react";

import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle } from "react-native";

import { spectrum } from "@/theme";

export interface InputProps extends TextInputProps {
  disabled?: boolean;
  error?: boolean | string | Error;
  style?: StyleProp<TextStyle>;
}

const Input = forwardRef<TextInput, InputProps>(function CustomInput(props, ref) {
  const { disabled = false, error, style: styleProp, ...rest } = props;

  const inputStyles = StyleSheet.flatten([
    styles.input,
    {
      borderColor: error ? "red" : "gray",
      opacity: disabled ? 0.6 : 1,
    },
    styleProp,
  ]);

  return (
    <TextInput
      editable={!disabled}
      placeholderTextColor={spectrum.gray9}
      ref={ref}
      selectTextOnFocus={!disabled}
      style={inputStyles}
      {...rest}
    />
  );
});

const shadow = {
  boxShadow: `0 4px 5px rgba(0, 0, 0, 0.2)`,
  elevation: 4,
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: spectrum.gray2,
    borderRadius: 8,
    borderWidth: 1,
    fontWeight: "normal",
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...shadow,
  },
});

export default Input;
