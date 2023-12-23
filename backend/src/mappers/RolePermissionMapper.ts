import { BaseMapper } from "./BaseMapper";

import { PermissionToRole } from "@entities/PermissionToRole";
import { IRolePermissionDto } from "@shared/types/dtos/Permission";

export class RolePermissionMapper
  extends BaseMapper<PermissionToRole>
  implements IRolePermissionDto
{
  signature: string;
  name: string;
  group: string;
  enabled: boolean;

  constructor(data: PermissionToRole) {
    super(data, ["enabled"]);

    this.assignInitialKeys();

    const { signature, name, group } = data.permission;

    this.signature = signature;
    this.name = name;
    this.group = group;

    return this;
  }
}
