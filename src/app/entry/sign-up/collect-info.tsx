import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "aws-amplify";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { z } from "zod";

import Button from "@/components/button";
import ErrorMessage from "@/components/error-message";
import FormErrorsMessage from "@/components/form-errors-message";
import Input from "@/components/input";
import InputWithActivityIndicator from "@/components/input-with-activity-indicator";
import { inputWidth } from "@/constants/constants";
import api from "@/lib/api";
import { isUsernameAvailable } from "@/service/auth";
import { useAuthStore } from "@/store";
import { AsYouType, phoneFormatterE164, isValidPhone } from "@/utils/phone";

import type { CognitoAuthResponse } from "@/types/auth";

const schema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  // .refine((val) => isValidPhone(val), {
  //   message: "Please enter a valid phone number",
  // }),
});

type FormValues = z.infer<typeof schema>;

const CollectInfoScreen = () => {
  const account = useAuthStore((s) => s.account);
  const setToken = useAuthStore((s) => s.setToken);
  const tempMessage = useAuthStore((s) => s.tempMessage);

  const {
    clearErrors,
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setError: setErrorForm,
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
    },
    resolver: zodResolver(schema),
  });

  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const usernameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);

  const router = useRouter();

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const onBlurUsername = async (value: string) => {
    if (!value) {
      clearErrors("username");
      return;
    }
    setIsCheckingUsername(true);
    const isAvailable = await isUsernameAvailable(value);
    if (!isAvailable) {
      setErrorForm("username", {
        type: "manual",
        message: "Sorry, that username already exists. Please choose another.",
      });
    } else {
      clearErrors("username");
    }
    setIsCheckingUsername(false);
  };

  // for some reason, zod doesn't handle onBlur and refine, so we handle it here
  const onBlurPhone = async (value: string) => {
    if (!value) {
      clearErrors("phone");
      return;
    }
    if (!isValidPhone(value)) {
      setErrorForm("phone", {
        type: "manual",
        message: "Please enter a valid phone number",
      });
    } else {
      clearErrors("phone");
    }
  };

  const onSubmit = async (formData: FormValues) => {
    setLoading(true);
    setError(null);
    const currentData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_tag: formData.username,
      phone: phoneFormatterE164(formData.phone),
      email: account,
    };

    let id_token: string | null = null;
    let access_token: string | null = null;

    try {
      const user = await Auth.currentAuthenticatedUser();
      const accessToken = user.signInUserSession.accessToken.jwtToken;
      const idToken = user.signInUserSession.idToken.jwtToken;
      id_token = idToken;
      access_token = accessToken;
    } catch (error) {
      console.error("[onSubmit] Unknown error:", error);
    }

    if (!id_token || !access_token) {
      setError(new Error("Failed to get user session"));
      setLoading(false);
      return;
    }

    const updatedData = {
      ...currentData,
      id_token,
      access_token,
    };

    let response: CognitoAuthResponse;
    try {
      // this API endpoint does not need auth, so we can use 'ky' or 'api'
      response = await api
        .post<CognitoAuthResponse>("user/mobile-signup", { json: updatedData })
        .json();
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      return;
    }

    const token = response.token;
    setToken(token);

    setLoading(false);
    router.push("/entry/sign-up/success");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.pageTitleText}>Complete your profile</Text>
        {tempMessage && (
          <Text style={styles.explanationText} numberOfLines={1} adjustsFontSizeToFit>
            {tempMessage}
          </Text>
        )}
        <ErrorMessage error={error} />
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { name, onChange, onBlur, value } }) => (
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                id={name}
                keyboardType="default"
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={() => lastNameInputRef.current?.focus()}
                placeholder="First Name"
                ref={firstNameInputRef}
                returnKeyType="next"
                style={styles.textInput}
                textContentType="givenName"
                value={value}
              />
            )}
          />
          <FormErrorsMessage errors={errors} name="firstName" />
        </View>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { name, onChange, onBlur, value } }) => (
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                id={name}
                keyboardType="default"
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={() => usernameInputRef.current?.focus()}
                placeholder="Last Name"
                ref={lastNameInputRef}
                returnKeyType="next"
                style={styles.textInput}
                textContentType="familyName"
                value={value}
              />
            )}
          />
          <FormErrorsMessage errors={errors} name="lastName" />
        </View>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="username"
            render={({ field: { name, onChange, onBlur, value } }) => (
              <InputWithActivityIndicator
                autoCapitalize="none"
                autoCorrect={false}
                id={name}
                keyboardType="default"
                isLoading={isCheckingUsername}
                onBlur={() => {
                  onBlurUsername(value);
                  onBlur();
                }}
                onChangeText={onChange}
                onSubmitEditing={() => phoneInputRef.current?.focus()}
                placeholder="Username"
                ref={usernameInputRef}
                returnKeyType="next"
                style={styles.textInput}
                textContentType="username"
                value={value}
              />
            )}
          />
          <FormErrorsMessage errors={errors} name="username" />
        </View>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { name, onChange, onBlur, value } }) => (
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                id={name}
                keyboardType="phone-pad"
                onBlur={() => {
                  onBlurPhone(value);
                  onBlur();
                }}
                onChangeText={(val: string) => {
                  const formatted = new AsYouType("US").input(val);
                  onChange(formatted);
                }}
                placeholder="Phone Number"
                ref={phoneInputRef}
                returnKeyType="done"
                style={styles.textInput}
                textContentType="telephoneNumber"
                value={value}
              />
            )}
          />
          <FormErrorsMessage errors={errors} name="phone" />
        </View>
        <View style={styles.visualAdjustment}>
          <Button
            buttonStyle={{ width: inputWidth }}
            disabled={loading || !isDirty || !isValid}
            label="Next"
            onPress={handleSubmit(onSubmit)}
            size="lg"
            variant="primary"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

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
  explanationText: {
    fontSize: 16,
    marginTop: -8, // this visual spacing feels better
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
});

export default CollectInfoScreen;
