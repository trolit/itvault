import { SuperSchema } from "types/SuperSchema";
import { AddControllerTypes } from "types/controllers/Workspace/AddController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useStoreSuperSchema: SuperSchema.Runner<
  void,
  AddControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: useAddEditBodySchema(),
  };
});
