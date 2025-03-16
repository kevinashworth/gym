import * as EmailValidator from "email-validator";

function isValidEmail(email: string): boolean {
  return EmailValidator.validate(email);
}

export { isValidEmail };
