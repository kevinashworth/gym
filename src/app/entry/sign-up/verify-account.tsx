import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "aws-amplify";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";
import TextLink from "react-native-text-link";
import { z } from "zod";

import Button from "@/components/button";
import ErrorMessage from "@/components/error-message";
import FormErrorsMessage from "@/components/form-errors-message";
import Input from "@/components/input";
import { inputWidth } from "@/constants/constants";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";

const schema = z.object({
  confirmCode: z
    .string()
    .min(1, { message: "Confirmation code is required" })
    .refine((val) => val.length === 6, {
      message: "Confirmation code must be 6 digits",
    }),
});

type FormValues = z.infer<typeof schema>;

const SignUpVerifyScreen = () => {
  const showDevToolbox = useDevStore((s) => s.showDevToolbox);
  const {
    clearErrors,
    control,
    formState: { errors, isDirty, isValid },
    handleSubmit,
    setError: setErrorForm,
  } = useForm<FormValues>({
    defaultValues: {
      confirmCode: "",
    },
    resolver: zodResolver(schema),
  });

  // const account = useAuthStore((s) => s.account);
  const account = "kashworth+brogue@gotyou.co";

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  // const [valid, setValid] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // State for resend cooldown
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const onSubmit = handleSubmit(async (data) => {
    // if (valid) return;
    setLoading(true);
    setError(null);
    const { confirmCode } = data;

    if (!account) {
      setError(new Error("No email address found"));
      setLoading(false);
      return;
    }

    try {
      await Auth.confirmSignUp(account, confirmCode);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      return;
    }

    // setValid(true);
    setLoading(false);
    router.push("/entry/sign-up/collect-info");
  });

  function resendConfirmCode(account: string) {
    console.log("resendConfirmCode", account);
    Auth.resendSignUp(account);
    setResendCooldown(60);
    setCanResend(false);
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.pageTitleText}>Verify your email</Text>
        <Text style={styles.explanationText} numberOfLines={2} adjustsFontSizeToFit>
          You will receive a confirmation code to your email{" "}
          <Text style={styles.email}>{account}</Text>
        </Text>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="confirmCode"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
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
          disabled={loading || !isDirty || !isValid}
          label="Next"
          onPress={onSubmit}
          size="lg"
          variant="primary"
        />
        <View style={{ gap: 16, padding: 16 }}>
          <View>
            <Text style={styles.textHelpful}>Didn’t get it?</Text>
            <TextLink
              links={[
                {
                  text: "Resend",
                  onPress: () => {
                    console.log("resend", canResend);
                    if (!canResend) return;
                    resendConfirmCode(account);
                  },
                },
              ]}
              textStyle={[styles.textHelpful, { fontVariant: ["tabular-nums"] }]}
              textLinkStyle={{
                color: canResend ? spectrum.primary : spectrum.base2Content,
                textDecorationLine: "underline",
              }}>
              {canResend ? "Resend." : `Resend in ${resendCooldown}s`}
            </TextLink>
          </View>
          <View>
            <Text style={styles.textHelpful}>Weird dev state?</Text>
            <TextLink
              links={[
                {
                  text: "collect-info",
                  onPress: () => {
                    router.push("/entry/sign-up/collect-info");
                  },
                },
              ]}
              textStyle={styles.textHelpful}
              textLinkStyle={{
                color: spectrum.primary,
                textDecorationLine: "underline",
              }}>
              Go to collect-info.
            </TextLink>
          </View>
        </View>
        {showDevToolbox && (
          <View style={styles.toolbox}>
            <Text style={styles.toolboxHeader}>Dev Toolbox</Text>
            <Button
              iconName="arrow-right"
              label="collect-account.tsx"
              onPress={() => router.push("/entry/sign-up/collect-account")}
              size="sm"
              variant="primary"
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
      </View>
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
  email: {
    fontWeight: 500,
  },
  textInput: {
    width: inputWidth,
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

export default SignUpVerifyScreen;
