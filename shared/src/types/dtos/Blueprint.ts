export interface IBlueprintDto {
  id: number;

  name: string;

  description: string;

  pinnedAt: string | null;

  color: string;

  createdAt: string;

  updatedAt: string;

  isDeleted: boolean;
}

export interface IAddEditBlueprintDto {
  name: string;

  description: string;

  color: string;
}
