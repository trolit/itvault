import { SuperCommonParam, SuperSchema } from "super-schema-types";

export const defineSuperSchemaRunner = (
  superSchemaRunner: (
    common: SuperCommonParam
  ) => SuperSchema | Promise<SuperSchema>
) => superSchemaRunner;
