export interface IBlueprintDTO {
  id: number;

  name: string;

  description: string;

  pinnedAt: string | null;

  color: string;

  createdAt: string;

  updatedAt: string;

  isDeleted: boolean;
}

export interface IAddEditBlueprintDTO {
  name: string;

  description: string;

  color: string;
}
