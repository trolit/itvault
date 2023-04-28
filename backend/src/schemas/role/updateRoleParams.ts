import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { SuperSchemaRunner } from "@utils/types";
import { schemaForType } from "@helpers/schemaForType";
import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

const updateRoleParamsSchemaRunner: SuperSchemaRunner = () => {
  return schemaForType<{ id: number }>()(
    z.object({
      id: z.coerce
        .number()
        .gte(0)
        .superRefine((id, context: RefinementCtx) => {
          if (id === HEAD_ADMIN_ROLE_ID) {
            context.addIssue({
              code: ZodIssueCode.custom,
              message: "This role is not editable.",
            });

            return Zod.NEVER;
          }
        }),
    })
  );
};

export const updateRoleParamsSchema = (() => {
  return updateRoleParamsSchemaRunner;
})();
