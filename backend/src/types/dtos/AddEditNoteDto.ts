import { Note } from "@entities/Note";
import { CommentableResource } from "@enums/CommentableResource";

export type AddEditNoteDto = Pick<Note, "id"> & {
  text: string;

  resource: CommentableResource;
};
