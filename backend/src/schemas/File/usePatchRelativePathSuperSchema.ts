import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { Di } from "@enums/Di";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";
import { baseWorkspaceSchemas } from "@schemas/Workspace/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { workspaceIdSchema } = baseWorkspaceSchemas;

export const usePatchRelativePathSuperSchema: SuperSchemaRunner =
  defineSuperSchemaRunner(() => {
    return {
      query: useQuerySchema(),
      body: useBodySchema(),
      params: useParamsSchema(),
    };
  });

function useQuerySchema(): SchemaProvider {
  return () => workspaceIdSchema;
}

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
    );
}
