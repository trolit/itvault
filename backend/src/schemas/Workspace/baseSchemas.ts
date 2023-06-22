import { Di } from "types/enums/Di";
import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { schemaForType } from "@schemas/common/schemaForType";
import { IWorkspaceRepository } from "types/interfaces/repository/IWorkspaceRepository";

const paramsSchema = schemaForType<{
  workspaceId: number;
}>()(
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

        const workspace = await workspaceRepository.getById(id);

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

export const baseSchemas = {
  params: paramsSchema,
};
