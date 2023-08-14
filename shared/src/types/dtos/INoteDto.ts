export interface INoteDto {
  id: number;

  value: string;

  createdAt: string;

  createdBy: { fullName: string; role: string };

  updatedBy: string;

  isDeleted: boolean;
}
