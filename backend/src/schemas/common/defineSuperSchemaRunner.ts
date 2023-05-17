import { SuperCommonParam, SuperSchema } from "@custom-types/super-schema";

export const defineSuperSchemaRunner = (
  superSchemaRunner: (
    common: SuperCommonParam
  ) => SuperSchema | Promise<SuperSchema>
) => superSchemaRunner;
