/* eslint-disable @typescript-eslint/consistent-type-definitions */

declare module "@custom-types/super-schema" {
  import { Request } from "express";
  import type { ZodSchema } from "zod";

  export type SuperKeys = {
    body: string;

    query: string;

    params: string;
  };

  export type SuperCommonParam = {
    request: Request;
  };

  export type SchemaProvider = () =>
    | (ZodSchema | null)
    | Promise<ZodSchema | null>;

  export type SuperSchema = Partial<Record<keyof SuperKeys, SchemaProvider>>;

  export type SuperSchemaRunner = (
    common: SuperCommonParam
  ) => SuperSchema | Promise<SuperSchema>;
}
