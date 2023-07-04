import { z } from "zod";

import { NoteDto } from "@dtos/NoteDto";
import { Resource } from "@enums/Resource";

import { schemaForType } from "@schemas/common/schemaForType";

type ResourceRequest = Pick<NoteDto, "id" | "resource">;

export const resourceSchema = schemaForType<ResourceRequest>()(
  z.object({
    id: z.coerce.number().gt(0),

    resource: z.nativeEnum(Resource),
  })
);

export const baseSchemas = {
  resourceSchema,
};
