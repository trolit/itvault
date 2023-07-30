import { object, string } from "yup";
import { SuperSchemaElement } from "super-schema-types";

export const useVersionSchema: (
  versions: string[]
) => SuperSchemaElement<{ version: string }> = (versions: string[]) =>
  object({
    version: string()
      .required()
      .oneOf(versions, "Wrong resource version (available: ${values})"),
  });
