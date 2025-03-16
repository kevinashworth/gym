import { StyleSheet, Text } from "react-native";

import { spectrum } from "@/theme";

import type { FieldError } from "react-hook-form";

interface ErrorMessageProps {
  error: string | Error | FieldError | undefined;
  size?: string;
}

function ErrorMessage({ error, size = "large", ...props }: ErrorMessageProps) {
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

  return (
    <Text style={styles.errorText} {...props}>
      {errorMessage}
    </Text>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: spectrum.error,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 12,
    paddingHorizontal: 12,
  },
});

export default ErrorMessage;
