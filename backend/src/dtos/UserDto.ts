export class UserDto {
  email = "";

  roleId: number;

  roleName: string;

  permissions: { id: number; name: string; enabled: boolean }[];
}
