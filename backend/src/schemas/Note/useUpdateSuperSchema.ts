import { object } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { UpdateControllerTypes } from "types/controllers/Note/UpdateController";

import { addEditBodySchema } from "./addEditBodySchema";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchemaElement<UpdateControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.NoteRepository),
  });

const bodySchema: SuperSchemaElement<UpdateControllerTypes.v1.Body> =
  addEditBodySchema;

export const useUpdateSuperSchema: SuperSchemaRunner<
  UpdateControllerTypes.v1.Params,
  UpdateControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    body: bodySchema,
  };
});
