import { z } from "zod";

import { schemaForType } from "@schemas/common/schemaForType";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const storeSchema: SuperSchemaRunner = defineSuperSchemaRunner(() => {
  return {
    // @TODO body schema validation
  };
});
