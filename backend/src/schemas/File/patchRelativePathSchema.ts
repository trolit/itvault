import { z } from "zod";

import { schemaForType } from "@schemas/common/schemaForType";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";
import { baseSchema } from "@schemas/Workspace/baseSchema";

export const patchRelativePathSchema: SuperSchemaRunner =
  defineSuperSchemaRunner(() => {
    return {
      params: useParamsSchema(),
    };
  });

function useParamsSchema(): SchemaProvider {
  return () =>
    baseSchema.params.merge(
      schemaForType<{ fileId: number }>()(
        z.object({
          fileId: z.coerce.number().gt(0),
        })
      )
    );
}
