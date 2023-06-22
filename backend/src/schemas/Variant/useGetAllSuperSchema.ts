import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { schemaForType } from "@schemas/common/schemaForType";
import { IFileRepository } from "types/interfaces/repository/IFileRepository";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () =>
    schemaForType<{ fileId: number }>()(
      z.object({
        fileId: z
          .number()
          .gt(0)
          .superRefine(async (value: number, context: RefinementCtx) => {
            if (value <= 0) {
              return Zod.NEVER;
            }

            const fileRepository = getInstanceOf<IFileRepository>(
              Di.FileRepository
            );

            const file = await fileRepository.getById(value);

            if (!file) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message: "File is not available.",
              });

              return Zod.NEVER;
            }
          }),
      })
    );
}
