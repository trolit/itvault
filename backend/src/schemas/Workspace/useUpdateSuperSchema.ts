import { object } from "yup";
import { SuperSchemaElement, SuperSchemaRunner } from "super-schema-types";
import { UpdateControllerTypes } from "types/controllers/Workspace/UpdateController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchemaElement<UpdateControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.WorkspaceRepository),
  });

export const useUpdateSuperSchema: SuperSchemaRunner<
  UpdateControllerTypes.v1.Params,
  UpdateControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(({ request }) => {
  const {
    params: { id },
  } = request;

  return {
    params: paramsSchema,
    body: useAddEditBodySchema(id),
  };
});
