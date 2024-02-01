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

  fileId: number;
}

export interface IPatchNoteValueDTO {
  text: string;
}
