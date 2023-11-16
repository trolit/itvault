import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { PinControllerTypes } from "types/controllers/Workspace/PinController";
import { UnpinControllerTypes } from "types/controllers/Workspace/UnpinController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

// @NOTE to "watch over" both Pin/Unpin types
type TogglePinParams = Pick<PinControllerTypes.v1.Params, "id"> &
  Pick<UnpinControllerTypes.v1.Params, "id">;

const paramsSchema: SuperSchema.Fragment<TogglePinParams> = object({
  id: useIdNumberSchema(Di.WorkspaceRepository),
});

export const useTogglePinSuperSchema: SuperSchema.Runner<
  TogglePinParams,
  void,
  void
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
  };
});
