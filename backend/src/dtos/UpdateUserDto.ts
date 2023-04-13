export class UpdateUserDto {
  id: number;

  data: { roleId?: number; isActive?: boolean };
}
