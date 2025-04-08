import React, { forwardRef, useState, useEffect } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import Input, { type InputProps } from "@/components/input";
import { spectrum } from "@/theme";

interface InputWithClearButtonProps extends InputProps {
  value?: string;
}

const InputWithClearButton = forwardRef<TextInput, InputWithClearButtonProps>(
  function CustomInput(props, ref) {
    const { value, ...rest } = props;

    const [val, setVal] = useState<string>(value || "");

    useEffect(() => {
      if (value) {
        setVal(value);
      } else {
        setVal("");
      }
    }, [value]);

    return (
      <>
        <Input ref={ref} value={val} {...rest} />
        {val && (
          <TouchableOpacity style={styles.icon_block} onPress={() => setVal("")}>
            <Ionicons name="close-circle" size={20} color={spectrum.gray8} />
          </TouchableOpacity>
        )}
      </>
    );
  }
);

const styles = StyleSheet.create({
  icon_block: {
    position: "absolute",
    right: 12,
    top: 9,
  },
});

export default InputWithClearButton;
