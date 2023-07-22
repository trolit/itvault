import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { AddEditBlueprintDto } from "@dtos/AddEditBlueprintDto";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { schemaForType } from "@schemas/common/schemaForType";

const getAddEditBodySchema = (
  blueprintRepository: IBlueprintRepository,
  workspaceId?: string
) => {
  const parsedWorkspaceId = workspaceId ? parseInt(workspaceId) : null;

  if (!parsedWorkspaceId) {
    return null;
  }

  return schemaForType<AddEditBlueprintDto>()(
    z.object({
      name: z.string().superRefine(async (value, context: RefinementCtx) => {
        const blueprint = await blueprintRepository.getOne({
          where: {
            name: value,
            workspace: {
              id: parsedWorkspaceId,
            },
          },
        });

        if (blueprint) {
          context.addIssue({
            code: ZodIssueCode.custom,
            message: "This name is not available.",
          });

          return Zod.NEVER;
        }
      }),

      description: z.string().min(10),

      color: z
        .string()
        .regex(/^#[a-zA-Z0-9]{6}$/, "Color needs to be in hexadecimal pattern.")
        .superRefine(async (value, context: RefinementCtx) => {
          const blueprint = await blueprintRepository.getOne({
            where: {
              color: value,
              workspace: {
                id: parsedWorkspaceId,
              },
            },
          });

          if (blueprint) {
            context.addIssue({
              code: ZodIssueCode.custom,
              message: "This color is not available.",
            });

            return Zod.NEVER;
          }
        }),
    })
  );
};

export const baseBlueprintSchemas = {
  getAddEditBodySchema,
};
