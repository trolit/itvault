import { BlueprintDto } from "types/dtos/BlueprintDto";
import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import {
  SchemaProvider,
  SuperCommonParam,
  SuperSchemaRunner,
} from "super-schema-types";

import { Di } from "@enums/Di";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";
import { baseWorkspaceSchemas } from "@schemas/Workspace/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { workspaceIdSchema } = baseWorkspaceSchemas;

export const useStoreSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  ({ request }: SuperCommonParam) => {
    const {
      params: { workspaceId },
    } = request;

    return {
      query: useQuerySchema(),
      body: useBodySchema(workspaceId),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () => workspaceIdSchema;
}

function useBodySchema(workspaceId?: string): SchemaProvider {
  const blueprintRepository = getInstanceOf<IBlueprintRepository>(
    Di.BlueprintRepository
  );

  const parsedWorkspaceId = workspaceId ? parseInt(workspaceId) : null;

  if (!parsedWorkspaceId) {
    return () => null;
  }

  return () =>
    schemaForType<BlueprintDto>()(
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
          .regex(
            /^#[a-zA-Z0-9]{6}$/,
            "Color needs to be in hexadecimal pattern."
          )
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
}
