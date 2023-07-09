import { z } from "zod";

import { NoteDto } from "@dtos/NoteDto";
import { CommentableResource } from "@enums/CommentableResource";

import { schemaForType } from "@schemas/common/schemaForType";

export const resourceSchema = schemaForType<Pick<NoteDto, "id" | "resource">>()(
  z.object({
    id: z.coerce.number().gt(0),

    resource: z.nativeEnum(CommentableResource),
  })
);

export const baseNoteSchemas = {
  resourceSchema,
};
