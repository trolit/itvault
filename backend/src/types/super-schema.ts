declare module "super-schema-types" {
  import { Request } from "express";
  import type { ZodSchema } from "zod";

  export type SuperKeys = {
    body: string;

    query: string;

    params: string;
  };

  export type SuperCommonParam<P, B, Q> = {
    request: CustomRequest<P, B, Q>;
  };

  export type SchemaProvider = () =>
    | (ZodSchema | null)
    | Promise<ZodSchema | null>;

  export type SuperSchema = Partial<Record<keyof SuperKeys, SchemaProvider>>;

  export type SuperSchemaRunner = <P, B, Q>(
    common: SuperCommonParam<P, B, Q>
  ) => SuperSchema | Promise<SuperSchema>;
}
