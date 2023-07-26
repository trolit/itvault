import { Note } from "@entities/Note";
import { CommentableResource } from "@enums/CommentableResource";

export type AddEditNoteDto = Pick<Note, "id" | "value"> & {
  resource: CommentableResource;
};
