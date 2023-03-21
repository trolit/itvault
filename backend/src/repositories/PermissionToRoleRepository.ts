import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { PermissionToRole } from "@entities/PermissionToRole";

@injectable()
export class PermissionToRoleRepository extends Repository<PermissionToRole> {}
