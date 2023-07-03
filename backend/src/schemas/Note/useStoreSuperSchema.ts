import sanitizeHtml from "sanitize-html";
import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { NoteDto, Resource } from "@dtos/NoteDto";
import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

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

        text: z.string().transform(value => sanitizeHtml(value)),

        resource: z.nativeEnum(Resource),
      })
    ).superRefine(async (value: NoteDto, context: RefinementCtx) => {
      const { id, resource } = value;

      if (!Resource[resource]) {
        return Zod.NEVER;
      }

      const repository = getInstanceOf<IBaseRepository<unknown>>(
        `I${resource}Repository`
      );

      const entity = await repository.getById(id);

      if (!entity) {
        context.addIssue({
          code: ZodIssueCode.custom,
          message: `${resource} is not available.`,
        });

        return Zod.NEVER;
      }
    });
}
