import { z } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { NoteDto, Target } from "@dtos/NoteDto";

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
        id: z.coerce.number().gt(0),

        text: z.string(),

        target: z.nativeEnum(Target),
      })
    );
}
