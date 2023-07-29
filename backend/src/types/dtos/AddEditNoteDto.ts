import { Note } from "@entities/Note";
import { Resource } from "@enums/Resource";

export type AddEditNoteDto = Pick<Note, "id"> & {
  text: string;

  resource: Resource;
};
