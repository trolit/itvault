import { z } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { NoteDto } from "@dtos/NoteDto";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useStoreSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      body: useBodySchema(),
    };
  }
);

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<NoteDto>()(
      z.object({
        text: z.string(),

        fileId: z.coerce.number().gt(0),
      })
    );
}
