import { useEffect, useState } from "react";

import { Auth } from "aws-amplify";
import { useRouter } from "expo-router";
import { Controller, useFormContext } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";
import TextLink from "react-native-text-link";

import Button from "@/components/button";
import ErrorMessage from "@/components/error-message";
import FormErrorsMessage from "@/components/form-errors-message";
import Input from "@/components/input";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";

const inputWidth = 244;

const SignUpVerifyScreen = () => {
  const enableDevToolbox = useDevStore((s) => s.enableDevToolbox);
  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    setError: setErrorForm,
    watch,
  } = useFormContext();
  const accountValue = watch("account");

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    if (valid) return true;
    setLoading(true);
    setError(null);
    const { account, confirmCode } = data;

    try {
      await Auth.confirmSignUp(account, confirmCode);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      return false;
    }

    setValid(true);
    setLoading(false);
    return true;
  });

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.pageTitleText}>Verify your account</Text>
        <Text
          style={styles.explanationText}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          You will receive a code to your email at {accountValue}
        </Text>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="confirmCode"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                disabled={valid}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Confirmation Code"
                style={styles.textInput}
                textContentType="oneTimeCode"
                value={value}
              />
            )}
          />
          <FormErrorsMessage errors={errors} name="confirmCode" />
          <ErrorMessage error={error} style={styles.inputContainer} />
        </View>
        <Button
          buttonStyle={{ width: inputWidth }}
          disabled={loading}
          label="Next"
          onPress={onSubmit}
          size="lg"
          variant="primary"
        />

        <View style={{ alignItems: "center" }}>
          <Text style={styles.textHelpful}>Didn’t get it?</Text>
          <TextLink
            links={[
              {
                text: "Resend",
                onPress: () => console.log("resend"),
              },
            ]}
            textStyle={styles.textHelpful}
            textLinkStyle={{
              color: spectrum.primary,
              textDecorationLine: "underline",
            }}
          >
            Resend.
          </TextLink>
        </View>
      </View>
      {enableDevToolbox && (
        <View
          style={{
            alignItems: "center",
            borderColor: spectrum.black,
            borderWidth: StyleSheet.hairlineWidth,
            gap: 2,
            justifyContent: "center",
            margin: 16,
            paddingHorizontal: 8,
            paddingTop: 2,
            paddingBottom: 8,
          }}
        >
          <Text
            style={{
              color: spectrum.black,
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 21,
              paddingBottom: 8,
              textAlign: "center",
            }}
          >
            Dev Toolbox
          </Text>
          <Button
            iconName="arrow-right"
            label="collect-account.tsx"
            onPress={() => router.push("/entry/sign-up/collect-account")}
            size="sm"
            variant="black"
          />
          <Button
            iconName="refresh"
            label="Toggle Error State (confirmCode)"
            onPress={() => {
              if (!errors.confirmCode) {
                setErrorForm("confirmCode", {
                  type: "custom",
                  message: "Confirm code error message goes here.",
                });
              } else {
                clearErrors("confirmCode");
              }
            }}
            size="sm"
            variant="black"
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
  },
  inputContainer: {
    gap: 8,
    width: inputWidth,
  },
  pageTitleText: {
    fontSize: 24,
    fontWeight: 700,
    marginTop: 32,
    textAlign: "center",
  },
  explanationText: {
    fontSize: 16,
    marginTop: -8, // this visual spacing feels better
    paddingHorizontal: 32,
    textAlign: "center",
  },
  textInput: {
    width: inputWidth,
  },
  textHelpful: {
    color: spectrum.base2Content,
    fontSize: 16,
    fontWeight: 500,
  },
});

export default SignUpVerifyScreen;
