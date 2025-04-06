import React, { forwardRef } from "react";

import { ActivityIndicator, StyleSheet, TextInput } from "react-native";

import Input, { type InputProps } from "@/components/input";
import { spectrum } from "@/theme";

interface CustomInputProps extends InputProps {
  isLoading?: boolean;
}

const InputWithActivityIndicator = forwardRef<TextInput, CustomInputProps>(
  function CustomInput(props, ref) {
    const { isLoading = false, ...rest } = props;

    return (
      <>
        <Input ref={ref} {...rest} />
        {isLoading && (
          <ActivityIndicator size="small" color={spectrum.primary} style={styles.icon_block} />
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

export default InputWithActivityIndicator;
