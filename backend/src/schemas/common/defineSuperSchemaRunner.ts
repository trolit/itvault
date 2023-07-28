import { SuperCommonParam, SuperSchema } from "super-schema-types";

// @TODO refactor to allow to specify for which endpoint version super schema is defined
export const defineSuperSchemaRunner = <P, B, Q>(
  superSchemaRunner: (
    common: SuperCommonParam<P, B, Q>
  ) => SuperSchema<P, B, Q> | Promise<SuperSchema<P, B, Q>>
) => superSchemaRunner;
