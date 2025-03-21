import { zodResolver } from "@hookform/resolvers/zod";
import { Slot, Stack } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { z } from "zod";

import { isValidEmail } from "@/utils/email";
import { zPassword } from "@/utils/password";

const schema = z
  .object({
    account: z.string().refine((val) => isValidEmail(val), {
      message: "Please enter a valid email",
    }),
    password: zPassword,
    password2: z.string(),
    confirmCode: z.string().refine((val) => val.length === 6, {
      message: "Confirmation code must be 6 digits",
    }),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    phone: z.string(),
    email: z.string(),
    signUpCode: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password2"],
        message: `Passwords don’t match`,
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function SignUpLayout() {
  const methods = useForm<FormValues>({
    defaultValues: {
      // part 1
      account: "",
      password: "",
      password2: "",
      // part 2
      confirmCode: "",
      // part 3
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
      email: "",
      // part 4
      signUpCode: "",
    },
    resolver: zodResolver(schema),
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <FormProvider {...methods}>
        <Slot />
      </FormProvider>
    </ScrollView>
  );
}
