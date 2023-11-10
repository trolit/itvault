import { IAuthorDto } from "./IAuthorDto";

export interface IRoleDto {
  id: number;

  name: string;

  createdAt: string;

  updatedAt: string;

  createdBy: IAuthorDto | null;

  updatedBy: IAuthorDto | null;
}
