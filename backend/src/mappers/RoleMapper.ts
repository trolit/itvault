import { BaseMapper } from "./BaseMapper";

import { Role } from "@entities/Role";
import { IRoleDto } from "@shared/types/dtos/IRoleDto";

export class RoleMapper extends BaseMapper<Role> implements IRoleDto {
  id: number;
  name: string;

  constructor(data: Role, keys: (keyof Role)[] = ["id", "name"]) {
    super(data, keys);

    return this;
  }
}
