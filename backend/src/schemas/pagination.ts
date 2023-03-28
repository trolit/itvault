import { z } from "zod";
import { schemaForType } from "@helpers/schemaForType";

export const paginationSchema = schemaForType<{ take: number; skip: number }>()(
  z.object({
    take: z.number().positive().gte(0),
    skip: z.number().positive().gte(0),
  })
);
