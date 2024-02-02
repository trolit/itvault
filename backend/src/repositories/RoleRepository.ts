import { injectable } from "tsyringe";
import { Role } from "@db/entities/Role";
import { IRoleRepository } from "types/repositories/IRoleRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  constructor() {
    super(Role);
  }
}
