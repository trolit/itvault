import { BaseMapper } from "./BaseMapper";

import { Permission } from "@entities/Permission";
import { IPermissionDTO } from "@shared/types/DTOs/Permission";

export class PermissionMapper
  extends BaseMapper<Permission>
  implements IPermissionDTO
{
  signature: string;
  name: string;
  group: string;

  constructor(data: Permission) {
    super(data, ["signature", "name", "group"]);

    this.assignInitialKeys();
  }
}
