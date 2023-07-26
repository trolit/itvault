import { Note } from "@entities/Note";
import { BaseMapDto } from "./BaseMapDto";

export class NoteMapDto extends BaseMapDto<Note> {
  createdBy: string;
  updatedBy: string;

  constructor(
    data: Note,
    keys: (keyof Note)[] = ["id", "value", "createdAt", "updatedBy"]
  ) {
    super(data, keys);

    const { createdBy, updatedBy } = data;

    this.createdBy = createdBy.fullName;
    this.updatedBy = updatedBy.fullName;

    return this;
  }
}
