import { z } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { FILES } from "@config";

import { baseSchemas } from "@schemas/Workspace/baseSchemas";
import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

import { IQuery } from "@controllers/File/GetAllController";

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      params: useParamsSchema(),
      query: useQuerySchema(),
    };
  }
);

function useParamsSchema(): SchemaProvider {
  return () => baseSchemas.params;
}

function useQuerySchema(): SchemaProvider {
  return () =>
    schemaForType<IQuery>()(
      z
        .object({
          relativePath: z.string().default(FILES.ROOT),
          blueprintId: z.coerce.number().gt(0),
        })
        .partial()
        .refine(
          data => !!data.blueprintId || !!data.relativePath,
          "Either blueprintId or relativePath should be provided in query."
        )
    );
}
