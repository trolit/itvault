import { Role } from "@db/entities/Role";

import { BaseMapper } from "./BaseMapper";

import { IRoleDTO } from "@shared/types/DTOs/Role";
import { IAuthorDTO } from "@shared/types/DTOs/User";

export class RoleMapper extends BaseMapper<Role> implements IRoleDTO {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  createdBy: IAuthorDTO | null;
  updatedAt: string;
  updatedBy: IAuthorDTO | null;

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
