import { SuperSchemaRunner } from "super-schema-types";
import { StoreControllerTypes } from "types/controllers/Role/StoreController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useStoreSuperSchema: SuperSchemaRunner<
  void,
  StoreControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: useAddEditBodySchema(),
  };
});
