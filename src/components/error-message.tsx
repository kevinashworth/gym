import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

import { spectrum } from "@/theme";

import type { FieldError } from "react-hook-form";

export interface ErrorMessageProps extends TextProps {
  error?: string | Error | FieldError | null;
  size?: "medium" | "large";
  style?: TextStyle;
}

function ErrorMessage({
  error,
  size = "medium",
  style: customStyle,
  ...props
}: ErrorMessageProps) {
  if (!error) {
    return null;
  }

  const isError =
    typeof error === "string" || (typeof error === "object" && error.message);
  if (!isError) {
    console.warn("ErrorMessage: Invalid error prop:", error);
    return null;
  }

  const errorMessage = typeof error === "object" ? error.message : error;

  if (!errorMessage) {
    return null;
  }

  const fontSize = size === "large" ? 16 : 12;
  const fontWeight = size === "large" ? 600 : 500;

  return (
    <Text
      style={[styles.errorText, { fontSize, fontWeight }, customStyle]}
      {...props}
    >
      {errorMessage}
    </Text>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: spectrum.error,
    paddingHorizontal: 12,
  },
});

export default ErrorMessage;
