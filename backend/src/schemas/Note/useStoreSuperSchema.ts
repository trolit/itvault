import { object, string } from "yup";
import sanitizeHtml from "sanitize-html";
import { SuperSchema } from "types/SuperSchema";
import { StoreControllerTypes } from "types/controllers/Note/StoreController";

import { useResourceEntityTest } from "./useResourceEntityTest";

import { Resource } from "@enums/Resource";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<StoreControllerTypes.v1.Body> = object({
  text: string()
    .required()
    .transform(value => sanitizeHtml(value)),
  resource: object({
    id: useResourceEntityTest(),
    name: string().required().oneOf([Resource.File]),
  }),
});

export const useStoreSuperSchema: SuperSchema.Runner<
  void,
  StoreControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
