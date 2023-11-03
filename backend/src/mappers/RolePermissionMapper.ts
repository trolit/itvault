import { BaseMapper } from "./BaseMapper";

import { PermissionToRole } from "@entities/PermissionToRole";
import { IPermissionDto } from "@shared/types/dtos/IPermissionDto";

export class RolePermissionMapper
  extends BaseMapper<PermissionToRole>
  implements IPermissionDto
{
  signature: string;
  name: string;
  group: string;
  enabled: boolean;

  constructor(
    data: PermissionToRole,
    keys: (keyof PermissionToRole)[] = ["enabled"]
  ) {
    super(data, keys);

    const { signature, name, group } = data.permission;

    this.signature = signature;
    this.name = name;
    this.group = group;

    return this;
  }
}
