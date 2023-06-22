import { z } from "zod";

import { schemaForType } from "@schemas/common/schemaForType";
import { IPaginationOptions } from "types/interfaces/IPaginationOptions";

export const paginationSchema = schemaForType<IPaginationOptions>()(
  z.object({
    take: z.coerce.number().gt(0).max(9999),
    skip: z.coerce.number().gte(0).max(9999),
  })
);
