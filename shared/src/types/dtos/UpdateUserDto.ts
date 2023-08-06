export type UpdateUserDto = {
  id: number;

  data: { roleId?: number; isActive?: boolean };
};
