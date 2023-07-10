import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { FILES } from "@config";

import { schemaForType } from "@schemas/common/schemaForType";
import { baseWorkspaceSchemas } from "@schemas/Workspace/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

import { IQuery } from "@controllers/File/GetAllController";

const { workspaceIdSchema } = baseWorkspaceSchemas;

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  type IQueryPart = Pick<IQuery, "blueprintId" | "relativePath">;

  const optionalKeysSchema = schemaForType<IQueryPart>()(
    z.object({
      relativePath: z.optional(z.string().default(FILES.ROOT)),
      blueprintId: z.optional(z.coerce.number().gt(0)),
    })
  );

  return () =>
    workspaceIdSchema
      .merge(optionalKeysSchema)
      .superRefine(
        (
          value: { blueprintId?: number; relativePath?: string },
          context: RefinementCtx
        ) => {
          const { blueprintId, relativePath } = value;

          if (
            (!blueprintId && !relativePath) ||
            (blueprintId && relativePath)
          ) {
            context.addIssue({
              code: ZodIssueCode.custom,
              message: `Either blueprintId or relativePath should be provided in query.`,
            });

            return Zod.NEVER;
          }
        }
      );
}
