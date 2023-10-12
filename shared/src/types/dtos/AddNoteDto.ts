import { NoteResource } from "../enums/NoteResource";

export type AddNoteDto = {
  text: string;

  resource: {
    id: number | string;

    name: NoteResource;
  };
};
