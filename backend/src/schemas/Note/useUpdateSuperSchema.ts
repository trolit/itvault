import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { UpdateControllerTypes } from "types/controllers/Note/UpdateController";

import { addEditBodySchema } from "./addEditBodySchema";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchemaElement<UpdateControllerTypes.v1.Body> =
  addEditBodySchema;

export const useUpdateSuperSchema: SuperSchemaRunner<
  void,
  UpdateControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
