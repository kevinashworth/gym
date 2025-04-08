import React, { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "aws-amplify";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import TextLink from "react-native-text-link";
import { z } from "zod";

import Button from "@/components/button";
import ErrorMessage from "@/components/error-message";
import FormErrorsMessage from "@/components/form-errors-message";
import Input from "@/components/input";
import { inputWidth } from "@/constants/constants";
import { useAuthStore } from "@/store";
import { spectrum } from "@/theme";
import { isValidEmail } from "@/utils/email";

import type { FieldError } from "react-hook-form";

const schema = z.object({
  account: z
    .string()
    .min(1, { message: "Email Address is required" })
    .refine((val) => isValidEmail(val), {
      message: "Please enter a valid email",
    }),
});

type FormValues = z.infer<typeof schema>;

export default function ApplyRecoveryScreen() {
  const account = useAuthStore((s) => s.account);
  const setAccount = useAuthStore((s) => s.setAccount);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | Error | FieldError | undefined>(undefined);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      account: account,
    },
    resolver: zodResolver(schema),
  });

  const accountInputRef = useRef<TextInput>(null);

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError(undefined);
    const { account } = data;

    try {
      await Auth.forgotPassword(account);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      return;
    }

    setAccount(account);
    setLoading(false);
    router.push("/entry/recovery/submit");
  });

  console.log({ account, errors, isValid });

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitleText}>Forgot your password?</Text>
      <ErrorMessage error={error} />
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="account"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Email Address"
              ref={accountInputRef}
              returnKeyType="done"
              style={styles.textInput}
              textContentType="username"
              value={value}
            />
          )}
        />
        <FormErrorsMessage errors={errors} name="account" />
      </View>
      <Button
        buttonStyle={{ width: inputWidth }}
        disabled={loading || !isValid}
        label={loading ? "Sending..." : "Send Password Reset Email"}
        onPress={onSubmit}
        size="lg"
      />
      <View style={{ gap: 16, padding: 16 }}>
        <View>
          <Text style={styles.textHelpful}>Don't have an account?</Text>
          <TextLink
            links={[
              {
                text: "Sign up",
                onPress: () => router.push("/entry/sign-up/collect-account"),
              },
            ]}
            textStyle={styles.textHelpful}
            textLinkStyle={{
              color: spectrum.primary,
              textDecorationLine: "underline",
            }}>
            Sign up now.
          </TextLink>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
  },
  pageTitleText: {
    fontSize: 24,
    fontWeight: 700,
    marginTop: 32,
    textAlign: "center",
  },
  inputContainer: {
    gap: 8,
    width: inputWidth,
  },
  textInput: {
    width: inputWidth,
  },
  textHelpful: {
    color: spectrum.base2Content,
    fontSize: 14,
    textAlign: "center",
  },
});
