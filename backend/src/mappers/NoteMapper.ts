import { BaseMapper } from "./BaseMapper";

import { Note } from "@entities/Note";
import { INoteDto } from "@shared/types/dtos/INoteDto";

export class NoteMapper extends BaseMapper<Note> implements INoteDto {
  id: number;
  value: string;
  createdAt: string;
  updatedBy: string;
  isDeleted: boolean;
  createdBy: { fullName: string; role: string };

  constructor(
    data: Note,
    keys: (keyof Note)[] = ["id", "value", "createdAt", "updatedBy"]
  ) {
    super(data, keys);

    const { createdBy, updatedBy, deletedAt } = data;

    this.createdBy = {
      fullName: createdBy.fullName,
      role: createdBy.role.name,
    };

    this.updatedBy = updatedBy.fullName;
    this.isDeleted = !!deletedAt;

    return this;
  }
}
