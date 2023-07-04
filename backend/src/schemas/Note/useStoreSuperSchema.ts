import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { baseSchemas } from "./baseSchemas";
import { resourceSuperRefine } from "./resourceSuperRefine";

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

const { resourceSchema } = baseSchemas;

function useBodySchema(): SchemaProvider {
  const textSchema = schemaForType<Pick<NoteDto, "text">>()(
    z.object({
      text: z.string().transform(value => sanitizeHtml(value)),
    })
  );

  return () =>
    resourceSchema.merge(textSchema).superRefine(resourceSuperRefine);
}
