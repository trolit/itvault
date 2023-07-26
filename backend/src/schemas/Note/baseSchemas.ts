import { z } from "zod";

import { AddEditNoteDto } from "@dtos/AddEditNoteDto";
import { CommentableResource } from "@enums/CommentableResource";

import { schemaForType } from "@schemas/common/schemaForType";

export const resourceSchema = schemaForType<
  Pick<AddEditNoteDto, "id" | "resource">
>()(
  z.object({
    id: z.coerce.number().gt(0),

    resource: z.nativeEnum(CommentableResource),
  })
);

export const baseNoteSchemas = {
  resourceSchema,
};
