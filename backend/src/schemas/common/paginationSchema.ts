import { z } from "zod";

import { IPaginationQuery } from "@interfaces/IPaginationQuery";

import { schemaForType } from "@schemas/common/schemaForType";

export const paginationSchema = schemaForType<IPaginationQuery>()(
  z.object({
    page: z.coerce.number().int().gt(0),
    perPage: z.coerce.number().int().gte(0),
  })
);
