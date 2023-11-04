import { BaseMapper } from "./BaseMapper";

import { Permission } from "@entities/Permission";
import { IPermissionDto } from "@shared/types/dtos/IPermissionDto";

export class PermissionMapper
  extends BaseMapper<Permission>
  implements IPermissionDto
{
  signature: string;
  name: string;
  group: string;

  constructor(
    data: Permission,
    keys: (keyof Permission)[] = ["signature", "name", "group"]
  ) {
    super(data, keys);
  }
}
