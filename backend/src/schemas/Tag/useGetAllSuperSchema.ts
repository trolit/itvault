import { z } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { schemaForType } from "@schemas/common/schemaForType";
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
  return () =>
    schemaForType<IQuery>()(
      z.object({
        search: z.optional(z.string()),
      })
    );
}
