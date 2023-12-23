import { BaseMapper } from "./BaseMapper";

import { Role } from "@entities/Role";
import { IRoleDto } from "@shared/types/dtos/Role";
import { IAuthorDto } from "@shared/types/dtos/IAuthorDto";

export class RoleMapper extends BaseMapper<Role> implements IRoleDto {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  createdBy: IAuthorDto | null;
  updatedAt: string;
  updatedBy: IAuthorDto | null;

  constructor(data: Role) {
    super(data, ["id", "name", "description", "createdAt", "updatedAt"]);

    this.assignInitialKeys();

    const { createdBy, updatedBy } = data;

    this.createdBy = createdBy
      ? {
          id: createdBy.id,
          fullName: createdBy.fullName,
        }
      : null;

    this.updatedBy = updatedBy
      ? {
          id: updatedBy.id,
          fullName: updatedBy.fullName,
        }
      : null;

    return this;
  }
}
