import sanitizeHtml from "sanitize-html";
import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { AddControllerTypes } from "types/controllers/Note/AddController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<AddControllerTypes.v1.Query> = object({
  workspaceId: number().required(),
});

const bodySchema: SuperSchema.Fragment<AddControllerTypes.v1.Body> = object({
  text: string()
    .required()
    .transform(value => sanitizeHtml(value)),
  fileId: useIdNumberSchema(Di.FileRepository),
});

export const useAddSuperSchema: SuperSchema.Runner<
  void,
  AddControllerTypes.v1.Body,
  AddControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    body: bodySchema,
  };
});
