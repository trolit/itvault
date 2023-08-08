import { object, string } from "yup";
import { SuperSchemaElement, SuperSchemaRunner } from "super-schema-types";
import { SignInControllerTypes } from "types/controllers/Auth/SignInController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchemaElement<SignInControllerTypes.v1.Body> = object({
  // @NOTE https://www.rfc-editor.org/rfc/rfc5321#section-4.5.3
  email: string().required().email().max(254),
  password: string().required(),
});

export const useSignInSuperSchema: SuperSchemaRunner<
  void,
  SignInControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
