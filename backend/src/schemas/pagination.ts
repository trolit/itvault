import { z } from "zod";
import { schemaForType } from "@helpers/schemaForType";

export const paginationSchema = schemaForType<{ take: number; skip: number }>()(
  z.object({
    take: z.coerce.number().gte(0).max(9999),
    skip: z.coerce.number().gte(0).max(9999),
  })
);
