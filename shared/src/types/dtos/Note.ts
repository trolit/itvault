import { ResourceDTO } from "./ResourceDto";

export interface INoteDTO {
  id: number;

  value: string;

  createdAt: string;

  createdBy: { id: number; fullName: string; role: string };

  updatedBy: string;

  isDeleted: boolean;
}

export interface IAddNoteDTO {
  text: string;

  resource: ResourceDTO;
}

export interface IUpdateNoteDTO {
  text: string;
}
