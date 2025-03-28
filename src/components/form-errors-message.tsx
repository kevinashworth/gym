import { get } from "react-hook-form";

import ErrorMessage from "./error-message";

import type { ErrorMessageProps } from "./error-message";
import type { FieldErrors } from "react-hook-form";

interface FormErrorsMessageProps extends Omit<ErrorMessageProps, "error"> {
  errors: FieldErrors;
  name: string;
}

function FormErrorsMessage(props: FormErrorsMessageProps) {
  const { errors, name, ...rest } = props;
  const error = get(errors, name);

  if (!error) {
    return null;
  }

  const errorMessage: string = typeof error === "object" ? error.message : error;

  if (!errorMessage) {
    return null;
  }

  return <ErrorMessage error={errorMessage} {...rest} />;
}

export default FormErrorsMessage;
