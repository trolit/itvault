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
    schemaForType<{ workspaceId: number }>()(
      z.object({
        workspaceId: z.coerce
          .number()
          .gt(0)
          .superRefine(async (id, context: RefinementCtx) => {
            if (id <= 0) {
              return Zod.NEVER;
            }

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
