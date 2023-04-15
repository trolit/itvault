import { z } from "zod";

import { Di } from "@enums/Di";
import { SuperSchemaRunner } from "@utils/types";
import { schemaForType } from "@helpers/schemaForType";
import { existsSuperRefine } from "./common/existsSuperRefine";

const deleteSchemaRunner: SuperSchemaRunner<{ repository: Di }> = (
  commonParams,
  data
) => {
  if (!data?.repository) {
    return null;
  }

  const isRecordAvailable = existsSuperRefine(data.repository);

  return schemaForType<{ id: number }>()(
    z.object({
      id: z.coerce.number().superRefine(isRecordAvailable),
    })
  );
};

export const deleteSchema = (() => {
  return deleteSchemaRunner;
})();
