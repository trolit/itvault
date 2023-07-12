import { z } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { schemaForType } from "@schemas/common/schemaForType";
import { paginationSchema } from "@schemas/common/paginationSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

import { IQuery } from "@controllers/Tag/GetAllController";

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  type QueryParams = Omit<IQuery, "skip" | "take">;

  const otherQueryParamsSchema = schemaForType<QueryParams>()(
    z.object({
      search: z.optional(z.string()),
    })
  );

  return () => paginationSchema.merge(otherQueryParamsSchema);
}
