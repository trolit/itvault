import { ResourceDto } from "./ResourceDto";

export interface INoteDto {
  id: number;

  value: string;

  createdAt: string;

  createdBy: { id: number; fullName: string; role: string };

  updatedBy: string;

  isDeleted: boolean;
}

export interface IAddNoteDto {
  text: string;

  resource: ResourceDto;
}
