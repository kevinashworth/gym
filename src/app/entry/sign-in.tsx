import React, { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "aws-amplify";
import { useRouter } from "expo-router";
import ky from "ky";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import TextLink from "react-native-text-link";
import { z } from "zod";

import LogoDark from "@/assets/svg/logo-dark";
import Button from "@/components/button";
import DisplayJSON from "@/components/display-json";
import ErrorMessage from "@/components/error-message";
import FormErrorsMessage from "@/components/form-errors-message";
import Input from "@/components/input";
import InputPassword from "@/components/input-password";
import { useAuthStore, useDevStore } from "@/store";
import { spectrum } from "@/theme";
import { isValidEmail } from "@/utils/email";
import { zPassword } from "@/utils/password";

import type { CognitoUser } from "@/types/auth";
import type { FieldError } from "react-hook-form";

const inputWidth = 284;

type CognitoAuthResponse = {
  token: string;
};

const schema = z.object({
  account: z
    .string()
    .min(1, { message: "Email Address is required" })
    .refine((val) => isValidEmail(val), {
      message: "Please enter a valid email",
    }),
  password: zPassword,
});

type FormValues = z.infer<typeof schema>;

export default function SignInScreen() {
  const setCognitoUser = useAuthStore((s) => s.setCognitoUser);
  const setToken = useAuthStore((s) => s.setToken);
  const showDevToolbox = useDevStore((s) => s.showDevToolbox);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | Error | FieldError | undefined>(undefined);

  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    setError: setErrorForm,
  } = useForm<FormValues>({
    defaultValues: {
      account: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const accountInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const router = useRouter();

  // this is the signIn function
  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError(undefined);

    const { account, password } = data;
    Keyboard.dismiss();

    let user: CognitoUser | null = null;
    let response: CognitoAuthResponse;

    try {
      user = await Auth.signIn(account, password);
    } catch (error) {
      setLoading(false);
      setError(error as Error);
      return;
    }

    if (!user) {
      setError(new Error("No user found"));
      setLoading(false);
      return;
    }

    setCognitoUser(user);

    const accessToken = user.signInUserSession.accessToken.jwtToken;
    const idToken = user.signInUserSession.idToken.jwtToken;

    try {
      response = await ky
        .post<CognitoAuthResponse>(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/user/mobile-cognito-auth`,
          {
            json: {
              access_token: accessToken,
              id_token: idToken,
            },
          }
        )
        .json();
    } catch (error) {
      setLoading(false);
      setError(error as Error);
      return;
    }

    const token = response.token;

    setToken(token);
    setLoading(false);

    router.replace("/(tabs)");
  });

  return (
    <ScrollView
      bounces={false}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <LogoDark />
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
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                placeholder="Email Address"
                ref={accountInputRef}
                returnKeyType="next"
                style={styles.textInput}
                textContentType="username"
                value={value}
              />
            )}
          />
          <FormErrorsMessage errors={errors} name="account" />
        </View>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onBlur, onChange, value } }) => (
              <InputPassword
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={onSubmit}
                placeholder="Password"
                ref={passwordInputRef}
                returnKeyType="go"
                value={value}
                style={styles.textInput}
              />
            )}
          />
          <FormErrorsMessage errors={errors} name="password" />
        </View>
      </View>
      <View style={{ alignItems: "center", gap: 16, paddingTop: 20 }}>
        <Button
          disabled={loading}
          onPress={onSubmit}
          label={loading ? "Signing In ..." : "Sign In"}
          size="lg"
          buttonStyle={{
            width: inputWidth,
          }}
        />
        <View style={{ alignItems: "center" }}>
          <Text style={styles.textHelpful}>Forgot password?</Text>
          <TextLink
            links={[
              {
                text: "We got you",
                onPress: () => router.push("/"),
              },
            ]}
            textStyle={styles.textHelpful}
            textLinkStyle={{
              color: spectrum.primary,
              textDecorationLine: "underline",
            }}>
            We got you.
          </TextLink>
        </View>
      </View>

      {showDevToolbox && (
        <View style={styles.toolbox}>
          <Text style={styles.toolboxHeader}>Dev Toolbox</Text>
          <DisplayJSON json={{ error, errors, loading }} />
          <Button
            buttonStyle={{ width: 200 }}
            iconName="refresh"
            label="Toggle Loading State"
            onPress={() => setLoading(!loading)}
            size="sm"
          />
          <Button
            buttonStyle={{ width: 200 }}
            iconName="refresh"
            label="Toggle Overall Error State"
            onPress={() => setError(error ? undefined : "An error occurred")}
            size="sm"
            variant="black"
          />
          <Button
            buttonStyle={{ width: 220 }}
            iconName="refresh"
            label="Set Error State (account)"
            onPress={() =>
              setErrorForm("account", {
                type: "custom",
                message: "bad account",
              })
            }
            size="sm"
            variant="black"
          />
          <Button
            buttonStyle={{ width: 240 }}
            iconName="refresh"
            label="Set Error State (password)"
            onPress={() =>
              setErrorForm("password", {
                type: "custom",
                message: "bad password",
              })
            }
            size="sm"
            variant="black"
          />
          <Button
            buttonStyle={{ width: 200 }}
            iconName="refresh"
            label="Clear Errors"
            onPress={() => {
              clearErrors();
              setError(undefined);
            }}
            size="sm"
            variant="black"
          />
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 16,
    paddingTop: 32,
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
    fontSize: 16,
    fontWeight: 500,
  },
  toolbox: {
    alignItems: "center",
    backgroundColor: spectrum.gray1,
    borderColor: spectrum.gray8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    gap: 8,
    margin: 8,
    padding: 8,
  },
  toolboxHeader: {
    color: spectrum.primaryLight,
    fontSize: 12,
    fontWeight: 400,
    textAlign: "center",
  },
});
