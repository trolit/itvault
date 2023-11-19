import { injectable } from "tsyringe";
import { IRoleRepository } from "types/repositories/IRoleRepository";

import { BaseRepository } from "./BaseRepository";

import { Role } from "@entities/Role";

@injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  constructor() {
    super(Role);
  }
}
