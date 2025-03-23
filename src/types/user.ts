import { z } from "zod";

// const typicalUser = {
//   user_tag: "SolidScribe",
//   first_name: "ricky",
//   last_name: "he",
//   phone1: "+12792478039",
//   phone2: "",
//   global_user_notifications: true,
//   email: "rhe@freshlime.com",
//   external_pool_id: "us-west-2_L7xR4E7Yc",
//   external_user_id: "fdb14339-b74d-4657-9846-a6f490b01d82",
//   notification_email: "",
//   token_balance_get: 3,
//   token_balance_get_in_process: 0,
//   token_balance_gyt: 0,
//   token_balance_gyt_in_process: 0,
// };

// api.get("/user/")
export const UserProfileSchema = z.object({
  user_tag: z.string().min(1, { message: "User tag is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  phone1: z.string().min(1, { message: "Phone number is required" }),
  phone2: z.string().optional(),
  global_user_notifications: z.boolean(),
  email: z.string().email({ message: "Email is required" }),
  external_pool_id: z.string(),
  external_user_id: z.string(),
  notification_email: z.string().optional(),
  token_balance_get: z.number(),
  token_balance_get_in_process: z.number(),
  token_balance_gyt: z.number(),
  token_balance_gyt_in_process: z.number(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// display some of these fields in the form, but all 6 are needed for the API
export const UserProfileEditFormSchema = z.object({
  user_tag: z.string().min(1, { message: "User tag is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  phone1: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Email is required" }),
  global_user_notifications: z.boolean(),
});

export type UserProfileEditForm = z.infer<typeof UserProfileEditFormSchema>;

// Pick<
//   UserProfile,
//   "user_tag" | "first_name" | "last_name" | "phone1" | "email"
// >;

// user can update these fields in the form
export const UserProfileEditableSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  phone1: z.string().min(1, { message: "Phone number is required" }),
  global_user_notifications: z.boolean(),
});

export type UserProfileEditable = z.infer<typeof UserProfileEditableSchema>;

// Pick<
//   UserProfile,
//   "first_name" | "last_name" | "phone1"
// >;
