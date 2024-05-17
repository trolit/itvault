import { PermissionToRole } from "@db/entities/PermissionToRole";

import { BaseMapper } from "./BaseMapper";

import { IRolePermissionDTO } from "@shared/types/DTOs/Role";

export class RolePermissionMapper
  extends BaseMapper<PermissionToRole>
  implements IRolePermissionDTO
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
  }
}
