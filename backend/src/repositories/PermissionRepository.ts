import { injectable } from "tsyringe";
import { IPermissionRepository } from "types/repositories/IPermissionRepository";

import { BaseRepository } from "./BaseRepository";

import { Permission } from "@entities/Permission";

@injectable()
export class PermissionRepository
  extends BaseRepository<Permission>
  implements IPermissionRepository
{
  constructor() {
    super(Permission);
  }
}
