declare module "super-schema-types" {
  import type { ZodSchema } from "zod";

  export type SuperKeys = {
    body: string;

    query: string;

    params: string;
  };

  export type SuperCommonParam<R> = {
    request: R;
  };

  export type SchemaProvider = () =>
    | (ZodSchema | null)
    | Promise<ZodSchema | null>;

  export type SuperSchema = Partial<Record<keyof SuperKeys, SchemaProvider>>;

  export type SuperSchemaRunner<R extends CustomRequest<any, any, any> = any> =
    (common: SuperCommonParam<R>) => SuperSchema | Promise<SuperSchema>;
}
