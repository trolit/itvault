import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { baseSchemas } from "@schemas/Workspace/baseSchemas";
import { schemaForType } from "@schemas/common/schemaForType";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { SuperSchemaRunner, SchemaProvider } from "@superSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const usePatchRelativePathSuperSchema: SuperSchemaRunner =
  defineSuperSchemaRunner(() => {
    return {
      body: useBodySchema(),
      params: useParamsSchema(),
    };
  });

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<{ relativePath: string }>()(
      z.object({
        relativePath: z
          .string()
          .trim()
          .regex(/^[a-zA-Z0-9/._-]+$/)
          .superRefine((value, context: RefinementCtx) => {
            if (value.includes("//")) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message: "Double slash is forbidden.",
              });

              return Zod.NEVER;
            }

            if (value.split(".").length !== 2) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message:
                  "Relative path should only contain one root indicator (dot).",
              });

              return Zod.NEVER;
            }

            if (value.includes("/") && !value.startsWith(".")) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message:
                  "Relative path should start with root indicator (dot).",
              });

              return Zod.NEVER;
            }
          }),
      })
    );
}

function useParamsSchema(): SchemaProvider {
  return () =>
    baseSchemas.params.merge(
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

              const file = await fileRepository.getById(id);

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
