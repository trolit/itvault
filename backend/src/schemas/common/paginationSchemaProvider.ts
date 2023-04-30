import { z } from "zod";

import { SchemaProvider } from "@utils/types";
import { schemaForType } from "@helpers/schemaForType";

export const paginationSchemaProvider: SchemaProvider = () =>
  schemaForType<{
    take: number;
    skip: number;
  }>()(
    z.object({
      take: z.coerce.number().gte(0).max(9999),
      skip: z.coerce.number().gte(0).max(9999),
    })
  );
