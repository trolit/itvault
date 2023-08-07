import { BaseMapper } from "./BaseMapper";

import { Note } from "@entities/Note";
import { INoteDto } from "@shared/types/dtos/INoteDto";

export class NoteMapper extends BaseMapper<Note> implements INoteDto {
  id: number;
  value: string;
  createdAt: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;

  constructor(
    data: Note,
    keys: (keyof Note)[] = ["id", "value", "createdAt", "updatedBy"]
  ) {
    super(data, keys);

    const { createdBy, updatedBy, deletedAt } = data;

    this.createdBy = createdBy.fullName;
    this.updatedBy = updatedBy.fullName;
    this.isDeleted = !!deletedAt;

    return this;
  }
}
