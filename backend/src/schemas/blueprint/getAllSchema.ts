import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { schemaForType } from "@helpers/schemaForType";
import { SchemaProvider, SuperSchemaRunner } from "@utils/types";
import { IWorkspaceRepository } from "@interfaces/repository/IWorkspaceRepository";
import { paginationSchemaProvider } from "@schemas/common/paginationSchemaProvider";

const paramsSchemaProvider: SchemaProvider = () => {
  return schemaForType<{ id: number }>()(
    z.object({
      id: z.coerce
        .number()
        .gte(0)
        .superRefine(async (id, context: RefinementCtx) => {
          const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
            Di.WorkspaceRepository
          );

          const workspace = await workspaceRepository.findById(id);

          if (!workspace) {
            context.addIssue({
              code: ZodIssueCode.custom,
              message: "Workspace is not available.",
            });

            return Zod.NEVER;
          }
        }),
    })
  );
};

const getAllBlueprintsSuperSchemaRunner: SuperSchemaRunner = async () => {
  return {
    params: paramsSchemaProvider,
    query: paginationSchemaProvider,
  };
};

export const getAllSchema = (() => {
  return getAllBlueprintsSuperSchemaRunner;
})();
