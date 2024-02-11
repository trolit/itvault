import { IRolePermissionDTO } from "./Role";

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

export interface ILoggedUserDTO {
  id: number;

  email: string;

  fullName: string;

  roleId: number;

  roleName: string;

  permissions: IRolePermissionDTO[];
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

export interface ISignUpDTO {
  id: number;

  email: string;

  signUpCode: string;

  password: string;
}

export interface ISignInDTO {
  email: string;

  password: string;
}

export interface IPatchUserToWorkspaceDTO {
  ids: number[];
}
