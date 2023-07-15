import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { Di } from "@enums/Di";
import { IWorkspaceRepository } from "@interfaces/repositories/IWorkspaceRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

import { IBody } from "@controllers/Workspace/StoreController";

export const useStoreSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      body: useBodySchema(),
    };
  }
);

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<IBody>()(
      z.object({
        name: z
          .string()
          .min(5)
          .superRefine(async (value: string, context: RefinementCtx) => {
            if (value.length < 5) {
              return Zod.NEVER;
            }

            const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
              Di.WorkspaceRepository
            );

            const workspace = await workspaceRepository.getOne({
              where: { name: value },
            });

            if (workspace) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message: "This name is already taken.",
              });

              return Zod.NEVER;
            }
          }),
        tags: z
          .array(
            z
              .string()
              .min(2)
              .regex(/^[a-zA-Z0-9]*$/)
          )
          .min(1),
      })
    );
}
