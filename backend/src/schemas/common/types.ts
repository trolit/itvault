import { ZodSchema } from "zod";

import { ISuperSchemaParams } from "@interfaces/ISuperSchemaParams";
import { ISuperSchemaProperties } from "@interfaces/ISuperSchemaProperties";

export type SchemaProvider = () =>
  | (ZodSchema | null)
  | Promise<ZodSchema | null>;

type SuperSchemaRunnerResult = Partial<
  Record<keyof ISuperSchemaProperties, SchemaProvider>
>;

export type SuperSchemaRunner = (
  commonParams: ISuperSchemaParams
) => SuperSchemaRunnerResult | Promise<SuperSchemaRunnerResult>;
