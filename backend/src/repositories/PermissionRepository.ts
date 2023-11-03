import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { IPermissionRepository } from "types/repositories/IPermissionRepository";

import { BaseRepository } from "./BaseRepository";

import { Permission } from "@entities/Permission";

@injectable()
export class PermissionRepository
  extends BaseRepository<Permission>
  implements IPermissionRepository
{
  protected database: Repository<Permission>;

  constructor() {
    super(Permission);
  }
}
