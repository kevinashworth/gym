import React, { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "aws-amplify";
import { useRouter } from "expo-router";
import ky, { HTTPError } from "ky";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import TextLink from "react-native-text-link";
import { z } from "zod";

import LogoDark from "@/assets/svg/logo-dark";
import Button from "@/components/button";
import ErrorMessage from "@/components/error-message";
import FormErrorsMessage from "@/components/form-errors-message";
import Input from "@/components/input";
import InputPassword from "@/components/input-password";
import { inputWidth } from "@/constants/constants";
import { useAuthStore, useDevStore } from "@/store";
import { spectrum } from "@/theme";
import { isValidEmail } from "@/utils/email";
import { zPassword } from "@/utils/password";

import type { CognitoAuthResponse, CognitoUser } from "@/types/auth";
import type { FieldError } from "react-hook-form";

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
  const setAccount = useAuthStore((s) => s.setAccount);
  const setCognitoUser = useAuthStore((s) => s.setCognitoUser);
  const setTempMessage = useAuthStore((s) => s.setTempMessage);
  const setTempUser = useAuthStore((s) => s.setTempUser);
  const setToken = useAuthStore((s) => s.setToken);
  const tempMessage = useAuthStore((s) => s.tempMessage); // this message would be from some error
  const showDevToolbox = useDevStore((s) => s.showDevToolbox);
  const showPageInfo = useDevStore((s) => s.showPageInfo);

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

    setAccount(account);
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
      if (error instanceof HTTPError && error.response.status === 428) {
        setLoading(false);
        setError(error as Error);
        setTempMessage("Please finish signing up");
        setTempUser(user);
        router.navigate("/entry/sign-up/collect-info");
        return;
      }
      setLoading(false);
      setError(error as Error);
      return;
    }

    const token = response.token;

    setToken(token);
    setLoading(false);

    router.replace("/(tabs)/dashboard");
  });

  return (
    <ScrollView
      bounces={false}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <LogoDark style={{ marginTop: 32 }} />
        {tempMessage && (
          <Text style={styles.explanationText} numberOfLines={1} adjustsFontSizeToFit>
            {tempMessage}
          </Text>
        )}
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
        <View style={styles.visualAdjustment}>
          <Button
            disabled={loading}
            onPress={onSubmit}
            label={loading ? "Signing In ..." : "Sign In"}
            size="lg"
            buttonStyle={{
              width: inputWidth,
            }}
          />
        </View>

        <View style={styles.textHelpfulContainer}>
          <View>
            <Text style={styles.textHelpful}>Forgot password?</Text>
            <TextLink
              links={[
                {
                  text: "We got you",
                  onPress: () => router.push("/entry/recovery/apply"),
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
              iconName="circle-x"
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
        {showPageInfo && <Text style={styles.pageInfo}>src/app/entry/sign-in.tsx</Text>}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
  },
  explanationText: {
    fontSize: 16,
    paddingHorizontal: 32,
    textAlign: "center",
  },
  inputContainer: {
    gap: 8,
    width: inputWidth,
  },
  textInput: {
    width: inputWidth,
  },
  visualAdjustment: {
    paddingTop: 4,
  },
  textHelpfulContainer: {
    gap: 16,
    padding: 16,
  },
  textHelpful: {
    color: spectrum.base2Content,
    fontSize: 14,
    textAlign: "center",
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
  pageInfo: {
    borderTopColor: spectrum.base3Content,
    borderTopWidth: 1,
    color: spectrum.base1Content,
    fontSize: 11,
    fontWeight: 300,
    marginTop: 4,
    paddingTop: 12,
    textAlign: "center",
  },
});
