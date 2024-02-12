import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { UpdateProfileControllerTypes } from "types/controllers/User/UpdateProfileController";

import { ACCOUNT_RULES } from "@shared/constants/rules";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { FIRST_NAME, LAST_NAME } = ACCOUNT_RULES;

const bodySchema: SuperSchema.Fragment<UpdateProfileControllerTypes.v1.Body> =
  object({
    firstName: string().required().min(FIRST_NAME.MIN_LENGTH),

    lastName: string().required().min(LAST_NAME.MIN_LENGTH),
  });

export const useUpdateProfileSuperSchema: SuperSchema.Runner<
  void,
  UpdateProfileControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
