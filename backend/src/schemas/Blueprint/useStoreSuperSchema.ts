import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "types/enums/Di";
import {
  SchemaProvider,
  SuperCommonParam,
  SuperSchemaRunner,
} from "@custom-types/super-schema";
import { BlueprintDto } from "@dtos/BlueprintDto";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { baseSchemas } from "@schemas/Workspace/baseSchemas";
import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";
import { IBlueprintRepository } from "types/interfaces/repository/IBlueprintRepository";

export const useStoreSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  ({ request }: SuperCommonParam) => {
    const {
      params: { workspaceId },
    } = request;

    return {
      params: useParamsSchema(),
      body: useBodySchema(workspaceId),
    };
  }
);

function useParamsSchema(): SchemaProvider {
  return () => baseSchemas.params;
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
