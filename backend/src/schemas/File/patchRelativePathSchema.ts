import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { baseSchema } from "@schemas/Workspace/baseSchema";
import { schemaForType } from "@schemas/common/schemaForType";
import { IFileRepository } from "@interfaces/repository/IFileRepository";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const patchRelativePathSchema: SuperSchemaRunner =
  defineSuperSchemaRunner(() => {
    return {
      params: useParamsSchema(),
    };
  });

function useParamsSchema(): SchemaProvider {
  return () =>
    baseSchema.params.merge(
      schemaForType<{ fileId: number }>()(
        z.object({
          fileId: z.coerce
            .number()
            .gt(0)
            .superRefine(async (id, context: RefinementCtx) => {
              if (id <= 0) {
                return Zod.NEVER;
              }

              const fileRepository = getInstanceOf<IFileRepository>(
                Di.FileRepository
              );

              const file = await fileRepository.findById(id);

              if (!file) {
                context.addIssue({
                  code: ZodIssueCode.custom,
                  message: "File is not available.",
                });

                return Zod.NEVER;
              }
            }),
        })
      )
    );
}
