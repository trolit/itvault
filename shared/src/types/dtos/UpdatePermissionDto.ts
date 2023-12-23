import { IRolePermissionDto } from "./Permission";

export type UpdatePermissionDto = Pick<
  IRolePermissionDto,
  "signature" | "enabled"
>;
