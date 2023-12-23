export interface IUserDto {
  id: number;

  email: string;

  fullName: string;

  isSignedUp: boolean;

  roleId: number;

  roleName: string;

  isActive: boolean;

  invitedBy: string | null;
}

export interface IAuthorDto {
  id: number;

  fullName: string;
}

export interface IUpdateUserDto {
  id: number;

  data: { roleId?: number; isActive?: boolean };
}
