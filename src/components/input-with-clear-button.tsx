import React, { forwardRef, Ref, useState, useEffect } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
} from "react-native";

import { spectrum } from "@/theme";

interface InputProps extends TextInputProps {
  disabled?: boolean;
  error?: boolean | string | Error;
  style?: StyleProp<TextStyle>;
  value?: string;
}

const Input = forwardRef(function CustomInput(props: InputProps, ref: Ref<TextInput>) {
  const { disabled = false, error, style: styleProp, value, ...rest } = props;

  const [val, setVal] = useState<string>(value || "");

  useEffect(() => {
    if (value) {
      setVal(value);
    } else {
      setVal("");
    }
  }, [value]);

  const inputStyles = StyleSheet.flatten([
    styles.input,
    {
      borderColor: error ? "red" : "gray",
      opacity: disabled ? 0.6 : 1,
    },
    styleProp,
  ]);

  return (
    <>
      <TextInput
        editable={!disabled}
        placeholderTextColor={spectrum.gray9}
        ref={ref}
        selectTextOnFocus={!disabled}
        style={inputStyles}
        value={val}
        {...rest}
      />
      {val && (
        <TouchableOpacity style={styles.icon_block} onPress={() => setVal("")}>
          <Ionicons name="close-circle" size={20} color={spectrum.gray8} />
        </TouchableOpacity>
      )}
    </>
  );
});

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
  icon_block: {
    position: "absolute",
    right: 12,
    top: 12,
  },
});
Input.displayName = "InputWithClearButton";

export default Input;
