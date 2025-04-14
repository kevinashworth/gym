import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "aws-amplify";
import { useRouter } from "expo-router";
import ky from "ky";
import { Controller, useForm, type FieldError } from "react-hook-form";
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import TextLink from "react-native-text-link";
import { z } from "zod";

import Button from "@/components/button";
import ErrorMessage from "@/components/error-message";
import FormErrorsMessage from "@/components/form-errors-message";
import Icon from "@/components/icon";
import Input from "@/components/input";
import InputPasswordControlled from "@/components/input-password-controlled";
import { inputWidth } from "@/constants/constants";
import { useAuthStore } from "@/store";
import { spectrum } from "@/theme";
import { zPassword } from "@/utils/password";

import type { CognitoAuthResponse, CognitoUser } from "@/types/auth";

const schema = z
  .object({
    resetCode: z
      .string()
      .length(6, { message: "Confirmation code must be 6 digits" })
      .regex(/^[0-9]{6}$/, { message: "Confirmation code must contains only digits" }),
    password: zPassword,
    confirm: z.string().min(1, { message: "Confirm Password is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirm"],
        message: `Passwords don’t match`,
      });
    }
  });

type FormValues = z.infer<typeof schema>;

function SubmitRecoveryScreen() {
  const account = useAuthStore((s) => s.account);
  const setCognitoUser = useAuthStore((s) => s.setCognitoUser);
  const setToken = useAuthStore((s) => s.setToken);

  const router = useRouter();

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      resetCode: "",
      password: "",
      confirm: "",
    },
    mode: "onBlur",
    resolver: zodResolver(schema),
  });
  const resetCode = watch("resetCode");
  const password = watch("password");
  const confirmPassword = watch("confirm");

  console.log({ account, resetCode, password, confirmPassword });

  const resetCodeInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmInputRef = useRef<TextInput>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | Error | FieldError | undefined>(undefined);

  // this is the reset-then-signIn function
  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError(undefined);

    const { resetCode, password } = data;
    Keyboard.dismiss();

    let result: string; //"SUCCESS" | "NOT_FOUND" | "EXPIRED" | "ALREADY_EXISTS" | "UNCONFIRMED" | "CONFIRMED" | "NOT_AUTHENTICATED" | "NOTHING_TO_DO" | "";
    try {
      result = await Auth.forgotPasswordSubmit(account, resetCode, password);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      return;
    }
    if (result !== "SUCCESS") {
      setError(new Error("Password reset failed"));
      setLoading(false);
      return;
    }

    // Now, we need to sign in. Same code as SignInScreen.
    let user: CognitoUser | null = null;
    let response: CognitoAuthResponse;

    try {
      user = await Auth.signIn(account, password);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
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
          { json: { access_token: accessToken, id_token: idToken } }
        )
        .json();
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      return;
    }

    const token = response.token;

    setToken(token);

    setLoading(false);
    router.replace("/(tabs)/dashboard");
  });

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/entry/recovery/apply");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageTitleVIew}>
        <Text style={styles.pageTitleText}>Sign in using your </Text>
        <Text style={styles.pageTitleText}>password-reset code</Text>
      </View>
      <ErrorMessage error={error} style={styles.inputContainer} />
      <View style={styles.inputContainer}>
        <Input disabled placeholder={"Email Address"} style={styles.textInput} value={account} />
        <TouchableOpacity style={styles.icon_block} onPress={handleGoBack}>
          <Icon name="square-pen" size={20} color={spectrum.gray10} />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="resetCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              placeholder={"6-digit reset code"}
              ref={resetCodeInputRef}
              returnKeyType="next"
              style={styles.textInput}
              textContentType="oneTimeCode"
              value={value}
            />
          )}
        />
        <FormErrorsMessage errors={errors} name="resetCode" />
      </View>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputPasswordControlled
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword(!showPassword)}
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={() => confirmInputRef.current?.focus()}
              placeholder="Password"
              ref={passwordInputRef}
              returnKeyType="next"
              style={styles.textInput}
              value={value}
            />
          )}
        />
        <FormErrorsMessage errors={errors} name="password" />
      </View>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="confirm"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputPasswordControlled
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword(!showPassword)}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Confirm password"
              ref={confirmInputRef}
              returnKeyType="done"
              style={styles.textInput}
              value={value}
            />
          )}
        />
        <FormErrorsMessage errors={errors} name="confirm" />
      </View>
      <Button
        buttonStyle={{ width: inputWidth }}
        disabled={loading}
        label="Next"
        onPress={onSubmit}
        size="lg"
        variant="primary"
      />
      <View style={{ gap: 16, padding: 16 }}>
        <View>
          <Text style={styles.textHelpful}>Seeking the default sign-in page?</Text>
          <TextLink
            links={[
              {
                text: "got you",
                onPress: () => router.push("/entry/sign-in"),
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
  pageTitleVIew: {
    marginTop: 32,
  },
  pageTitleText: {
    fontSize: 24,
    fontWeight: 700,
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
  icon_block: {
    position: "absolute",
    right: 12,
    top: 9,
  },
});

export default SubmitRecoveryScreen;
