import { number, object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { SignUpControllerTypes } from "types/controllers/User/SignUpController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchemaElement<SignUpControllerTypes.v1.Body> = object({
  id: number().required().integer(),

  email: string()
    .trim()
    .email()
    .max(254)
    .required()
    .transform(value => value.toLowerCase()),

  signUpCode: string().required(),

  password: string()
    .required()
    .min(7)
    .matches(/[a-z]/, "At least one lowercase letter")
    .matches(/[A-Z]/, "At least one uppercase letter")
    .matches(/\d/, "At least one digit")
    .matches(
      /[*.!@#$%^&(){}[\]:;<>,.?/~_+-=|]/,
      "At least one special character"
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
