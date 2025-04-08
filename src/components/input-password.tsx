import React, { forwardRef, useState } from "react";

import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import Icon from "@/components/icon";
import Input, { type InputProps } from "@/components/input";
import { spectrum } from "@/theme";

type InputPasswordProps = Omit<
  InputProps,
  "autoCapitalize" | "autoComplete" | "autoCorrect" | "secureTextEntry" | "textContentType"
>;

const InputPassword = forwardRef<TextInput, InputPasswordProps>(function CustomInput(props, ref) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Input
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        ref={ref}
        secureTextEntry={!showPassword}
        textContentType="password"
        {...props}
      />
      <TouchableOpacity style={styles.icon_block} onPress={() => setShowPassword(!showPassword)}>
        <Icon name={showPassword ? "eye-off" : "eye"} size={20} color={spectrum.gray8} />
      </TouchableOpacity>
    </>
  );
});

const styles = StyleSheet.create({
  icon_block: {
    position: "absolute",
    right: 12,
    top: 9,
  },
});

export default InputPassword;
