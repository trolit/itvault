import { z } from "zod";
import { schemaForType } from "@helpers/schemaForType";

export const deleteSchema = schemaForType<{ id: number }>()(
  z.object({
    id: z.coerce.number().gte(0),
  })
);
