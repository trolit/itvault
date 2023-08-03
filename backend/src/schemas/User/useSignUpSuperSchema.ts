import { number, object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { SignUpControllerTypes } from "types/controllers/User/SignUpController";

import { MESSAGES } from "@helpers/yup/messages";
import { setYupError } from "@helpers/yup/setError";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchemaElement<SignUpControllerTypes.v1.Body> = object({
  id: number().required().integer(),

  email: string()
    .trim()
    .email()
    .max(254, setYupError(MESSAGES.GENERAL.MAX_CHARACTERS, 254))
    .required()
    .transform(value => value.toLowerCase()),

  signUpCode: string().required(),

  password: string()
    .required()
    .min(7)
    .matches(/[a-z]/, setYupError(MESSAGES.AUTH.PASSWORD.ONE_LOWERCASE_LETTER))
    .matches(/[A-Z]/, setYupError(MESSAGES.AUTH.PASSWORD.ONE_UPPERCASE_LETTER))
    .matches(/\d/, setYupError(MESSAGES.AUTH.PASSWORD.ONE_DIGIT))
    .matches(
      /[*.!@#$%^&(){}[\]:;<>,.?/~_+-=|]/,
      setYupError(MESSAGES.AUTH.PASSWORD.ONE_SPECIAL_CHARACTER)
    ),
});

export const useSignUpSuperSchema: SuperSchemaRunner<
  void,
  SignUpControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
