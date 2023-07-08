import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { schemaForType } from "@schemas/common/schemaForType";

export const getVersionSchema = (versions: number[]) =>
  schemaForType<{ version: number }>()(
    z.object({
      version: z.coerce
        .number()
        .superRefine((value: number, context: RefinementCtx) => {
          if (!versions.includes(value)) {
            context.addIssue({
              code: ZodIssueCode.custom,
              message: `Wrong resource version. Requested: ${value}, available: [${versions.join(
                ","
              )}]`,
            });

            return Zod.NEVER;
          }
        }),
    })
  );
