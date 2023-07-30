import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { StoreControllerTypes } from "types/controllers/Note/StoreController";

import { addEditBodySchema } from "./addEditBodySchema";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchemaElement<StoreControllerTypes.v1.Body> =
  addEditBodySchema;

export const useStoreSuperSchema: SuperSchemaRunner<
  void,
  StoreControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
