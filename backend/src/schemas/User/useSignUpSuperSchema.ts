import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { SignUpControllerTypes } from "types/controllers/User/SignUpController";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<SignUpControllerTypes.v1.Body> = object({
  id: number().required().integer(),

  email: string()
    .trim()
    .email()
    .max(254, setYupError(CUSTOM_MESSAGES.GENERAL.MAX_CHARACTERS, 254))
    .required()
    .transform(value => value.toLowerCase()),

  signUpCode: string().required(),

  password: string()
    .required()
    .min(7)
    .matches(
      /[a-z]/,
      setYupError(CUSTOM_MESSAGES.AUTH.PASSWORD.ONE_LOWERCASE_LETTER)
    )
    .matches(
      /[A-Z]/,
      setYupError(CUSTOM_MESSAGES.AUTH.PASSWORD.ONE_UPPERCASE_LETTER)
    )
    .matches(/\d/, setYupError(CUSTOM_MESSAGES.AUTH.PASSWORD.ONE_DIGIT))
    .matches(
      /[*.!@#$%^&(){}[\]:;<>,.?/~_+-=|]/,
      setYupError(CUSTOM_MESSAGES.AUTH.PASSWORD.ONE_SPECIAL_CHARACTER)
    ),
});

export const useSignUpSuperSchema: SuperSchema.Runner<
  void,
  SignUpControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
