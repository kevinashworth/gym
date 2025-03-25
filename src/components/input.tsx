import React, { forwardRef } from "react";

import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from "react-native";

import { spectrum } from "@/theme";

interface InputProps extends TextInputProps {
  disabled?: boolean;
  error?: boolean | string | Error;
  style?: StyleProp<TextStyle>;
}

const Input = forwardRef<TextInput, InputProps>(
  function CustomInput(props, ref) {
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
  },
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: spectrum.gray2,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    fontWeight: "normal",
    padding: 12,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
Input.displayName = "MyInput";

export default Input;
