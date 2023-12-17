import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { SignInControllerTypes } from "types/controllers/Auth/SignInController";

import { AUTH_RULES } from "@shared/constants/rules";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<SignInControllerTypes.v1.Body> = object({
  // @NOTE https://www.rfc-editor.org/rfc/rfc5321#section-4.5.3
  email: string().required().email().max(AUTH_RULES.MAX_EMAIL_LENGTH),
  password: string().required(),
});

export const useSignInSuperSchema: SuperSchema.Runner<
  void,
  SignInControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
