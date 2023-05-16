import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { schemaForType } from "@schemas/common/schemaForType";
import { SchemaProvider, SuperSchemaRunner } from "@utils/types";
import { paginationSchema } from "@schemas/common/paginationSchema";
import { IWorkspaceRepository } from "@interfaces/repository/IWorkspaceRepository";

export const getAllSchema: SuperSchemaRunner = () => {
  return {
    params: useParamsSchema(),
    query: useQuerySchema(),
  };
};

function useParamsSchema(): SchemaProvider {
  return () =>
    schemaForType<{ id: number }>()(
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
}

function useQuerySchema(): SchemaProvider {
  return () => paginationSchema;
}
