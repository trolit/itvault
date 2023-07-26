import { Note } from "@entities/Note";
import { CommentableResource } from "@enums/CommentableResource";

export type AddNoteDto = Pick<Note, "id"> & {
  text: string;

  resource: CommentableResource;
};
