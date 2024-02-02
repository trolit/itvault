import { Note } from "@db/entities/Note";

import { BaseMapper } from "./BaseMapper";

import { INoteDTO } from "@shared/types/DTOs/Note";

export class NoteMapper extends BaseMapper<Note> implements INoteDTO {
  id: number;
  value: string;
  createdAt: string;
  updatedBy: string;
  isDeleted: boolean;
  createdBy: { id: number; fullName: string; role: string };

  constructor(data: Note) {
    super(data, ["id", "value", "createdAt", "updatedBy"]);

    this.assignInitialKeys();

    const { createdBy, updatedBy, deletedAt } = data;

    this.createdBy = {
      id: createdBy.id,
      fullName: createdBy.fullName,
      role: createdBy.role?.name,
    };

    this.updatedBy = updatedBy.fullName;
    this.isDeleted = !!deletedAt;

    return this;
  }
}
