import { z } from "zod";

import { IPaginationOptions } from "@interfaces/IPaginationOptions";

import { schemaForType } from "@schemas/common/schemaForType";

export const paginationSchema = schemaForType<IPaginationOptions>()(
  z.object({
    take: z.coerce.number().int().gt(0).max(9999),
    skip: z.coerce.number().int().gte(0).max(9999),
  })
);
