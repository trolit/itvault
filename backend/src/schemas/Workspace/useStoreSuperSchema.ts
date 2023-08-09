import { SuperSchema } from "types/SuperSchema";
import { StoreControllerTypes } from "types/controllers/Workspace/StoreController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useStoreSuperSchema: SuperSchema.Runner<
  void,
  StoreControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: useAddEditBodySchema(),
  };
});
