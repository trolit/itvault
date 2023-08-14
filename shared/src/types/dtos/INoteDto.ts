export interface INoteDto {
  id: number;

  value: string;

  createdAt: string;

  createdBy: { id: number; fullName: string; role: string };

  updatedBy: string;

  isDeleted: boolean;
}
