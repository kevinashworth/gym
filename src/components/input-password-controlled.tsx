import React, { forwardRef } from "react";

import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import Icon from "@/components/icon";
import Input, { InputProps } from "@/components/input";
import { spectrum } from "@/theme";

interface InputPasswordProps
  extends Omit<
    InputProps,
    "autoCapitalize" | "autoComplete" | "autoCorrect" | "secureTextEntry" | "textContentType"
  > {
  showPassword: boolean;
  onToggleShowPassword: () => void;
}

const InputPassword = forwardRef<TextInput, InputPasswordProps>(function CustomInput(
  { showPassword, onToggleShowPassword, ...props },
  ref
) {
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
      <TouchableOpacity style={styles.icon_block} onPress={onToggleShowPassword}>
        <Icon name={showPassword ? "eye-off" : "eye"} size={20} color={spectrum.gray8} />
      </TouchableOpacity>
    </>
  );
});

const styles = StyleSheet.create({
  icon_block: {
    position: "absolute",
    right: 12,
    top: 12,
  },
});
InputPassword.displayName = "MyInputPassword";

export default InputPassword;
