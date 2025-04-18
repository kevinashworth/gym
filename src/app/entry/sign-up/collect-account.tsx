import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "aws-amplify";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import TextLink from "react-native-text-link";
import { z } from "zod";

import Button from "@/components/button";
import DisplayJSON from "@/components/display-json";
import ErrorMessage from "@/components/error-message";
import FormErrorsMessage from "@/components/form-errors-message";
import Input from "@/components/input";
import InputPasswordControlled from "@/components/input-password-controlled";
import { inputWidth } from "@/constants/constants";
import { useAuthStore, useDevStore } from "@/store";
import { spectrum } from "@/theme";
// import { CognitoUser } from "@/types/auth";
import { isValidEmail } from "@/utils/email";
import { zPassword } from "@/utils/password";

const schema = z
  .object({
    account: z.string().refine((val) => isValidEmail(val), {
      message: "Please enter a valid email",
    }),
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

function SignUpWithEmailScreen() {
  const setAccount = useAuthStore((s) => s.setAccount);
  const showDevToolbox = useDevStore((s) => s.showDevToolbox);

  const router = useRouter();

  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      account: "",
      password: "",
      confirm: "",
    },
    resolver: zodResolver(schema),
  });

  const accountInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmInputRef = useRef<TextInput>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<Error | null>(null);

  const handleRedirectConfirm = () => {
    router.push("/entry/sign-up/verify-account");
  };

  const onSubmit = handleSubmit(async (data) => {
    setSignUpLoading(true);
    setSignUpError(null);
    try {
      await Auth.signUp({
        username: data.account,
        password: data.password,
        attributes: { email: data.account },
        autoSignIn: {
          enabled: true,
        },
      });
    } catch (error) {
      setSignUpError(error as Error); // TODO: Can we get an AuthError type or such from aws-amplify?
      setSignUpLoading(false);
      return;
    }
    setAccount(data.account);
    setSignUpLoading(false);
    router.push("/entry/sign-up/verify-account");
  });

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.pageTitleText}>Sign up with email</Text>
        <ErrorMessage error={signUpError} style={styles.inputContainer} />
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="account"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                placeholder={"Email Address"}
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
                placeholder="Confirm Password"
                ref={confirmInputRef}
                returnKeyType="done"
                style={styles.textInput}
                value={value}
              />
            )}
          />
          <FormErrorsMessage errors={errors} name="confirm" />
        </View>
        <View style={styles.visualAdjustment}>
          <Button
            buttonStyle={{ width: inputWidth }}
            disabled={signUpLoading}
            label="Next"
            onPress={onSubmit}
            size="lg"
            variant="primary"
          />
        </View>

        <View style={styles.textHelpfulContainer}>
          <View>
            <Text style={styles.textHelpful}>Already a user?</Text>
            <TextLink
              links={[
                {
                  text: "Sign in",
                  onPress: () => router.push("/entry/sign-in"),
                },
              ]}
              textStyle={styles.textHelpful}
              textLinkStyle={{
                color: spectrum.primary,
                textDecorationLine: "underline",
              }}>
              Sign in.
            </TextLink>
          </View>
          <View>
            <Text style={styles.textHelpful}>Have a code?</Text>
            <TextLink
              links={[
                {
                  text: "Confirm",
                  onPress: handleRedirectConfirm,
                },
              ]}
              textStyle={styles.textHelpful}
              textLinkStyle={{
                color: spectrum.primary,
                textDecorationLine: "underline",
              }}>
              Confirm your account.
            </TextLink>
          </View>
        </View>

        {showDevToolbox && (
          <View style={styles.toolbox}>
            <Text style={styles.toolboxHeader}>Dev Toolbox</Text>
            <Button
              iconName="arrow-right"
              label="verify-account.tsx"
              onPress={() => router.push("/entry/sign-up/verify-account")}
              size="sm"
              variant="primary"
            />
            <Button
              buttonStyle={{ width: 200 }}
              iconName="refresh"
              label="Toggle Overall Error State"
              onPress={() =>
                setSignUpError(
                  signUpError ? null : new Error("An overall error message from Auth.signUp")
                )
              }
              size="sm"
              variant="black"
            />
            <Button
              iconName="refresh"
              label="Toggle Error State (account)"
              onPress={() => {
                if (!errors.account) {
                  setError("account", {
                    type: "custom",
                    message: "A form-based `account` error message.",
                  });
                } else {
                  clearErrors("account");
                }
              }}
              size="sm"
              variant="black"
            />
            <Button
              iconName="refresh"
              label="Toggle Error State (password)"
              onPress={() => {
                if (!errors.password) {
                  setError("password", {
                    type: "custom",
                    message:
                      "A form-based `password` error message. This one is a little longer. It's designed to test the error message length.",
                  });
                } else {
                  clearErrors("password");
                }
              }}
              size="sm"
              variant="black"
            />
            <Button
              iconName="refresh"
              label="Toggle Error State (confirm)"
              onPress={() => {
                if (!errors.confirm) {
                  setError("confirm", {
                    type: "custom",
                    message: "Passwords don’t match.",
                  });
                } else {
                  clearErrors("confirm");
                }
              }}
              size="sm"
              variant="black"
            />
            <Button
              iconName="circle-x"
              label="Clear Errors"
              onPress={() => {
                clearErrors();
                setSignUpError(null);
              }}
              size="sm"
              variant="black"
            />
            <DisplayJSON json={{ errors, signUpError }} />
          </View>
        )}
      </View>
    </>
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
    borderColor: spectrum.black,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    gap: 8,
    margin: 8,
    padding: 8,
  },
  toolboxHeader: {
    color: spectrum.primaryLight,
    fontSize: 12,
    textAlign: "center",
  },
});

export default SignUpWithEmailScreen;
