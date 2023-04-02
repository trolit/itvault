import { z } from "zod";

import { Di } from "@enums/Di";
import { schemaForType } from "@helpers/schemaForType";
import { existsSuperRefine } from "./super-refines/exists";

export const deleteSchema = <T>(repository: Di) => {
  const isRecordAvailable = existsSuperRefine<T>(repository);

  return schemaForType<{ id: number }>()(
    z.object({
      id: z.coerce.number().superRefine(isRecordAvailable),
    })
  );
};
