import { Permission } from "@db/entities/Permission";
import { IBaseRepository } from "./IBaseRepository";

export interface IPermissionRepository extends IBaseRepository<Permission> {}
