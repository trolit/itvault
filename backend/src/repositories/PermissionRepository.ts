import { injectable } from "tsyringe";
import { Permission } from "@db/entities/Permission";
import { IPermissionRepository } from "types/repositories/IPermissionRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class PermissionRepository
  extends BaseRepository<Permission>
  implements IPermissionRepository
{
  constructor() {
    super(Permission);
  }
}
