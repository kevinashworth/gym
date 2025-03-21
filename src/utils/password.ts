import { z } from "zod";

import { specialChars, specialRegex } from "@/constants/constants";

export const zPassword = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/^[^\s]/, { message: "Password must not start with a space" })
  .regex(/[^\s]$/, { message: "Password must not end with a space" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(specialRegex, {
    message: `Password must contain at least one special character ${specialChars}`,
  });

// export default zPassword;

// export const isValidPassword = (password: string) => {
//   if (
//     !/^[^\s]/.test(password) ||
//     !/[^\s]$/.test(password) ||
//     !/[A-Z]/.test(password) ||
//     !/[a-z]/.test(password) ||
//     !/[0-9]/.test(password) ||
//     !specialRegex.test(password)
//   ) {
//     return [
//       "Password must not start or end with a space",
//       "Password must contain at least one uppercase letter",
//       "Password must contain at least one lowercase letter",
//       "Password must contain at least one number",
//       `Password must contain at least one special character ${specialChars}`,
//     ].join("@@");
//   }
// };
