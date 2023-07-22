import { SuperCommonParam, SuperSchema } from "super-schema-types";

// @TODO refactor to allow to specify for which endpoint version super schema is defined
export const defineSuperSchemaRunner = (
  superSchemaRunner: (
    common: SuperCommonParam
  ) => SuperSchema | Promise<SuperSchema>
) => superSchemaRunner;
