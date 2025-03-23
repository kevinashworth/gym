import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import Button from "@/components/button";
import FormErrorsMessage from "@/components/form-errors-message";
import Input from "@/components/input";
import api from "@/lib/api";
import { spectrum } from "@/theme";
import {
  UserProfile,
  UserProfileEditForm,
  UserProfileEditFormSchema,
} from "@/types/user";
import { AsYouType, phoneFormatter, phoneFormatterE164 } from "@/utils/phone";

/*
 * Regarding phone1 (and theoretically phone2):
 * We store phone1 in the db in E.164 format but display it in a formatted way.
 * When user edits phone1, we convert it to E.164 before sending it to the API.
 */

const inputWidth = 244;
const prefixUrl = (
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://test.api.gotyou.co"
).trim();

function UserProfileFormLoadingState() {
  return (
    <>
      {[
        "First Name",
        "Last Name",
        "User Name",
        "Email Address",
        "Phone Number",
      ].map((label) => (
        <View key={label} style={styles.inputContainer}>
          <Input disabled={true} placeholder={label} style={styles.textInput} />
        </View>
      ))}
      <Button
        buttonStyle={{ width: inputWidth }}
        disabled={true}
        icon={<ActivityIndicator />}
        onPress={() => {}}
        size="lg"
        variant="primary"
      />
    </>
  );
}

interface UserProfileFormProps {
  disableSubmitButton?: boolean;
  onSubmit: (data: UserProfileEditForm) => void;
  userProfile: UserProfile;
}

function UserProfileForm({
  disableSubmitButton = false,
  onSubmit,
  userProfile,
}: UserProfileFormProps) {
  const phone1Display = phoneFormatter(userProfile.phone1) ?? undefined;

  const {
    control,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<UserProfileEditForm>({
    resolver: zodResolver(UserProfileEditFormSchema),
    defaultValues: {
      ...userProfile,
      phone1: phone1Display,
    },
  });

  return (
    <>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="first_name"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={"First Name"}
              returnKeyType="next"
              style={styles.textInput}
              textContentType="givenName"
              value={value}
            />
          )}
        />
        <FormErrorsMessage errors={errors} name="first_name" />
      </View>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="last_name"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={"Last Name"}
              returnKeyType="next"
              style={styles.textInput}
              textContentType="familyName"
              value={value}
            />
          )}
        />
        <FormErrorsMessage errors={errors} name="last_name" />
      </View>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="user_tag"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              disabled={true}
              keyboardType="default"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={"User Name"}
              returnKeyType="next"
              style={styles.textInput}
              textContentType="username"
              value={value}
            />
          )}
        />
        <FormErrorsMessage errors={errors} name="user_tag" />
      </View>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              disabled={true}
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={"Email Address"}
              returnKeyType="next"
              style={styles.textInput}
              textContentType="emailAddress"
              value={value}
            />
          )}
        />
        <FormErrorsMessage errors={errors} name="email" />
      </View>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="phone1"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={(val: string) => {
                const formatted = new AsYouType("US").input(val);
                onChange(formatted);
              }}
              placeholder={"Phone Number"}
              returnKeyType="done"
              style={styles.textInput}
              textContentType="telephoneNumber"
              value={value}
            />
          )}
        />
        <FormErrorsMessage errors={errors} name="phone1" />
      </View>
      <Button
        buttonStyle={{ width: inputWidth }}
        disabled={disableSubmitButton || !isDirty || !isValid}
        label="Submit Changes"
        onPress={handleSubmit(onSubmit)}
        size="lg"
        variant="primary"
      />
    </>
  );
}

const ProfileScreen = () => {
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response: UserProfile = await api.get(`${prefixUrl}/user/`).json();
      return response;
    },
    staleTime: Infinity, // no background updates, see https://tkdodo.eu/blog/react-query-and-forms#no-background-updates
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: UserProfileEditForm) =>
      await api.put(`${prefixUrl}/user/`, {
        json: {
          ...values,
          phone1: phoneFormatterE164(values.phone1),
        },
      }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
      });
      // Invalidate and reset after mutation, see https://tkdodo.eu/blog/react-query-and-forms#invalidate-and-reset-after-mutation
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Stack.Screen options={{ title: "Edit Profile" }} />
          {isLoading || !userProfile ? (
            <UserProfileFormLoadingState />
          ) : (
            <UserProfileForm
              disableSubmitButton={isPending} // see https://tkdodo.eu/blog/react-query-and-forms#double-submit-prevention
              onSubmit={mutate}
              userProfile={userProfile}
            />
          )}
          <View style={styles.spacer} />
          <Button
            label="Change Password"
            onPress={() =>
              Toast.show({
                position: "bottom",
                type: "primary",
                text1: "Change Password",
                text2: "This feature is not yet implemented",
              })
            }
            size="md"
            variant="outline"
          />
          <Button
            label="Delete Account"
            onPress={() =>
              Toast.show({
                position: "bottom",
                type: "error",
                text1: "Delete Account",
                text2: "This feature is not yet implemented",
              })
            }
            size="md"
            variant="error"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    alignItems: "center",
    gap: 20,
    marginTop: 32,
    paddingBottom: 32,
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
    textAlign: "center",
  },
  spacer: {
    height: 1,
  },
});

export default ProfileScreen;
