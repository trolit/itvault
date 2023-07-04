import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { baseSchemas } from "./baseSchemas";
import { resourceSuperRefine } from "./resourceSuperRefine";

import { paginationSchema } from "@schemas/common/paginationSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { resourceSchema } = baseSchemas;

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () =>
    paginationSchema.merge(resourceSchema).superRefine(resourceSuperRefine);
}
