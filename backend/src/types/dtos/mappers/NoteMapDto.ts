import { Note } from "@entities/Note";
import { BaseMapDto } from "./BaseMapDto";
import { INoteDto } from "@shared/types/dtos/INoteDto";

export class NoteMapDto extends BaseMapDto<Note> implements INoteDto {
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
