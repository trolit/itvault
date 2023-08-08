import { PermissionDto } from "./PermissionDto";

export interface IRoleDto {
  id: number;

  name: string;

  permissions: PermissionDto[];
}
