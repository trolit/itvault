import { z } from "zod";

import { SuperSchemaRunner } from "@utils/types";
import { schemaForType } from "@helpers/schemaForType";

const updateRoleParamsSchemaRunner: SuperSchemaRunner = () => {
  return schemaForType<{ id: number }>()(
    z.object({
      id: z.coerce.number().gte(0),
    })
  );
};

export const updateRoleParamsSchema = (() => {
  return updateRoleParamsSchemaRunner;
})();
