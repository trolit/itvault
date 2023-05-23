import { Di } from "@enums/Di";
import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { schemaForType } from "@schemas/common/schemaForType";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";
import { IWorkspaceRepository } from "@interfaces/repository/IWorkspaceRepository";

export const childrenRouteEntrySchema: SuperSchemaRunner =
  defineSuperSchemaRunner(() => {
    return {
      params: useParamsSchema(),
    };
  });

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
