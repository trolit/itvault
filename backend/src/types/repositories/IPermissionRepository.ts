import { Permission } from "@entities/Permission";
import { IBaseRepository } from "./IBaseRepository";

export interface IPermissionRepository extends IBaseRepository<Permission> {}
