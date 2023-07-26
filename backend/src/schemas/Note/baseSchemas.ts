import { z } from "zod";

import { AddNoteDto } from "@dtos/AddNoteDto";
import { CommentableResource } from "@enums/CommentableResource";

import { schemaForType } from "@schemas/common/schemaForType";

export const resourceSchema = schemaForType<
  Pick<AddNoteDto, "id" | "resource">
>()(
  z.object({
    id: z.coerce.number().gt(0),

    resource: z.nativeEnum(CommentableResource),
  })
);

export const baseNoteSchemas = {
  resourceSchema,
};
