import { SuperCommonParam, SuperSchema } from "@superSchema";

export const defineSuperSchemaRunner = (
  superSchemaRunner: (
    common: SuperCommonParam
  ) => SuperSchema | Promise<SuperSchema>
) => superSchemaRunner;
