export interface IUserDTO {
  id: number;

  email: string;

  fullName: string;

  isSignedUp: boolean;

  roleId: number;

  roleName: string;

  isActive: boolean;

  invitedBy: string | null;
}

export interface IContributorDTO {
  id: number;

  email: string;

  fullName: string;
}

export interface IAuthorDTO {
  id: number;

  fullName: string;
}

export interface IAddUserDTO {
  email: string;

  firstName: string;

  lastName: string;

  roleId: number;
}

export interface IUpdateUserDTO {
  id: number;

  data: { roleId?: number; isActive?: boolean };
}

export interface IUpdateProfileDTO {
  firstName: string;

  lastName: string;
}

export interface IPatchUserToWorkspaceDTO {
  ids: number[];
}
