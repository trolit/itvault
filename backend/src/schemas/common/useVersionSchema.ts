import { object, string } from "yup";
import { SchemaProvider } from "super-schema-types";

export const useVersionSchema: (
  versions: string[]
) => SchemaProvider<{ version: string }> = (versions: string[]) =>
  object({
    version: string()
      .required()
      .oneOf(versions, "Wrong resource version (available: ${values})"),
  });
