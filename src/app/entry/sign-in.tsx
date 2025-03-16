import React, { useRef, useState } from "react";

import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import LogoDark from "@/assets/svg/logo-dark";
import Button from "@/components/button";
import DisplayJSON from "@/components/display-json";
import ErrorMessage from "@/components/error-message";
import Input from "@/components/input";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";
import { isValidEmail } from "@/utils/email";

function signIn(data: any) {
  console.log("signIn function called");
  console.log(JSON.stringify(data));
}

// const title = "email";
const required = "Email Address is required.";
const placeholder = "Email Address";
const validate = {
  isValid: (account: string) =>
    !account || isValidEmail(account) || "Please enter a valid email",
};

type FormData = {
  account: string;
  password: string;
};

export default function SignIn() {
  const enableDevToolbox = useDevStore((s) => s.enableDevToolbox);
  // const { signIn } = useAuth();
  //
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    control,
    formState: { errors },
    handleSubmit,
    // setValue,
  } = useForm<FormData>({
    defaultValues: {
      account: "",
      password: "",
    },
  });

  const accountInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    Keyboard.dismiss();
    return signIn(data);
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
                // error={errors.account}
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                placeholder={placeholder}
                ref={accountInputRef}
                returnKeyType="next"
                textContentType="username"
                value={value}
                style={styles.textInput}
              />
            )}
            rules={{
              required,
              validate,
            }}
          />
          <ErrorMessage error={errors.account} size="medium" />
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
                onSubmitEditing={handleSubmit(signIn)}
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
          <ErrorMessage error={errors.password} size="medium" />
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

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.textHelpful}>Forgot password?</Text>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text
              style={[
                styles.textHelpful,
                {
                  textDecorationStyle: "solid",
                  textDecorationLine: "underline",
                },
              ]}
            >
              We got you.
            </Text>
          </TouchableOpacity>
        </View>

        <ErrorMessage error={error} />
      </View>

      {enableDevToolbox && (
        <View style={styles.toolbox}>
          <Text style={styles.toolboxHeader}>Dev Toolbox</Text>
          <DisplayJSON json={{ error, loading }} />
          <Button
            iconName="refresh"
            onPress={() => setLoading(!loading)}
            label="Toggle Loading State"
          />
          <Button
            iconName="refresh"
            onPress={() => setError(error ? "" : "An error occurred")}
            label="Toggle Error State"
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
    // marginVertical: 8,
  },
  toolbox: {
    backgroundColor: spectrum.gray1,
    borderColor: spectrum.gray8,
    borderWidth: 2,
    borderRadius: 8,
    gap: 8,
    margin: 8,
    padding: 8,
  },
  toolboxHeader: {
    color: spectrum.primaryLight,
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
  },
});
