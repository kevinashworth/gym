import React, { useRef, useState } from "react";

import { Auth } from "aws-amplify";
import { useRouter } from "expo-router";
import ky from "ky";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import TextLink from "react-native-text-link";

import LogoDark from "@/assets/svg/logo-dark";
import Button from "@/components/button";
import DisplayJSON from "@/components/display-json";
import ErrorMessage from "@/components/error-message";
import Input from "@/components/input";
import { useAuthStore, useDevStore } from "@/store";
import { spectrum } from "@/theme";
import { isValidEmail } from "@/utils/email";

import type { FieldError } from "react-hook-form";

type FormData = {
  account: string;
  password: string;
};

type CognitoAuthResponse = {
  token: string;
};

export default function SignInScreen() {
  const setCognitoUser = useAuthStore((s) => s.setCognitoUser);
  const setToken = useAuthStore((s) => s.setToken);
  const enableDevToolbox = useDevStore((s) => s.enableDevToolbox);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | Error | FieldError | undefined>(
    undefined,
  );

  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    setError: setErrorForm,
  } = useForm<FormData>({
    defaultValues: {
      account: "",
      password: "",
    },
  });

  const accountInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const router = useRouter();

  // this is the signIn function
  const onSubmit = handleSubmit(async (data) => {
    const { account, password } = data;
    Keyboard.dismiss();
    console.log("signIn function called");
    console.log(JSON.stringify(data));

    setLoading(true);
    setError(undefined);

    let user = null;
    let response: CognitoAuthResponse;

    try {
      user = await Auth.signIn(account, password);
    } catch (error) {
      setLoading(false);
      setError(error as Error);
      return;
    }
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
          },
        )
        .json();
      console.log({ response });
    } catch (error) {
      setLoading(false);
      setError(error as Error);
      return;
    }
    const token = response.token;
    console.log({ token });
    setCognitoUser(user);
    setToken(token);
    // setUser({ ...user, ...data });
    setLoading(false);
    console.log({ user, response });
    router.replace("/(tabs)");
  });

  return (
    <ScrollView
      bounces={false}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <LogoDark />
        <View>
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
                textContentType="username"
                value={value}
                style={styles.textInput}
              />
            )}
            rules={{
              required: "Email Address is required.",
              validate: {
                isValid: (account: string) =>
                  !account ||
                  isValidEmail(account) ||
                  "Please enter a valid email",
              },
            }}
          />
          <ErrorMessage error={errors.account} style={{ paddingTop: 4 }} />
        </View>
        <View>
          <Controller
            control={control}
            name="password"
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={onSubmit}
                placeholder="Password"
                ref={passwordInputRef}
                returnKeyType="go"
                secureTextEntry
                textContentType="password"
                value={value}
                style={styles.textInput}
              />
            )}
            rules={{
              required: "Password is required.",
            }}
          />
          <ErrorMessage error={errors.password} style={{ paddingTop: 4 }} />
        </View>
      </View>
      <View style={{ alignItems: "center", gap: 16, paddingTop: 20 }}>
        <Button
          disabled={loading}
          onPress={onSubmit}
          label={loading ? "Signing In ..." : "Sign In"}
          size="lg"
          buttonStyle={{
            width: 284,
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
            }}
          >
            We got you.
          </TextLink>
        </View>

        <ErrorMessage error={error} />
      </View>

      {enableDevToolbox && (
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
  textInput: {
    width: 284,
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
