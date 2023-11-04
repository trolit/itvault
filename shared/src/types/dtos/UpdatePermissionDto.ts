import { IRolePermissionDto } from "./IRolePermissionDto";

export type UpdatePermissionDto = Pick<
  IRolePermissionDto,
  "signature" | "enabled"
>;
