import { object, string } from "yup";
import sanitizeHtml from "sanitize-html";
import { SuperSchema } from "types/SuperSchema";
import { AddControllerTypes } from "types/controllers/Note/AddController";

import { useResourceEntityTest } from "./useResourceEntityTest";

import { NoteResource } from "@shared/types/enums/NoteResource";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<AddControllerTypes.v1.Body> = object({
  text: string()
    .required()
    .transform(value => sanitizeHtml(value)),
  resource: object({
    id: useResourceEntityTest(),
    name: string().required().oneOf([NoteResource.File]),
  }),
});

export const useStoreSuperSchema: SuperSchema.Runner<
  void,
  AddControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
