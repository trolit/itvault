declare module "super-schema-types" {
  import { Schema } from "yup";

  export type SuperKeys = {
    body: string;

    query: string;

    params: string;
  };

  export type SuperSchemaElement<T = void> = Schema<T>;

  export type SuperCommonParam<P, B, Q> = {
    request: CustomRequest<P, B, Q>;
  };

  type SuperSchemaPart<T, K extends keyof SuperKeys> = T extends void
    ? {}
    : { [P in K]: Schema<T> };

  export type SuperSchema<P = void, B = void, Q = void> = SuperSchemaPart<
    P,
    "params"
  > &
    SuperSchemaPart<B, "body"> &
    SuperSchemaPart<Q, "query">;

  export type SuperSchemaRunner<P, B, Q> = (
    common: SuperCommonParam<P, B, Q>
  ) => SuperSchema<P, B, Q> | Promise<SuperSchema<P, B, Q>>;
}
