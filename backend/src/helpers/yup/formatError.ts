import { ValidationError, FormattedError } from "yup";

export const formatError = (error: unknown) => {
  if (!(error instanceof ValidationError)) {
    return "Not yup error!";
  }

  const formattedError: FormattedError = {};

  error.inner.forEach(value => {
    const path = value?.path || "unknown";
    const message = value.message;

    const key = path as keyof FormattedError;

    const formattedErrorValue = formattedError[key];

    formattedErrorValue ? formattedErrorValue.push(message) : [message];
  });

  return formattedError;
};
