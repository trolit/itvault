import { z } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";
import { GetAllControllerTypes } from "types/controllers/Tag/GetAllController";

import { schemaForType } from "@schemas/common/schemaForType";
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
    schemaForType<GetAllControllerTypes.v1.Query>()(
      z.object({
        search: z.optional(z.string()),
      })
    );
}
