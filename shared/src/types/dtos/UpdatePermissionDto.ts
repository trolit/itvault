import { IPermissionDto } from "./IPermissionDto";

export type UpdatePermissionDto = Pick<IPermissionDto, "signature" | "enabled">;
