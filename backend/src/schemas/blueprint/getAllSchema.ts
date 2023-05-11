import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { instanceOf } from "@helpers/instanceOf";
import { schemaForType } from "@helpers/schemaForType";
import { SchemaProvider, SuperSchemaRunner } from "@utils/types";
import { paginationSchemaProvider } from "@schemas/common/paginationSchemaProvider";
import { IWorkspaceRepository } from "@interfaces/repository/IWorkspaceRepository";

const paramsSchemaProvider: SchemaProvider = () => {
  return schemaForType<{ id: number }>()(
    z.object({
      id: z.coerce
        .number()
        .gte(0)
        .superRefine(async (id, context: RefinementCtx) => {
          const workspaceRepository = instanceOf<IWorkspaceRepository>(
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
