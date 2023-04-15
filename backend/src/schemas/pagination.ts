import { z } from "zod";

import { SuperSchemaRunner } from "@utils/types";
import { schemaForType } from "@helpers/schemaForType";

const paginationSchemaRunner: SuperSchemaRunner = () => {
  return schemaForType<{ take: number; skip: number }>()(
    z.object({
      take: z.coerce.number().gte(0).max(9999),
      skip: z.coerce.number().gte(0).max(9999),
    })
  );
};

export const paginationSchema = (() => {
  return paginationSchemaRunner;
})();
