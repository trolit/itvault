import { IRolePermissionDTO } from "./Role";

export interface IUserSessionDTO {
  userAgent: string;

  issuedAt: string;

  sessionId: string;

  isRequesterSession: boolean;

  // @TODO req.socket.remoteAddress
}

export interface ILoggedUserDTO {
  id: number;

  email: string;

  firstName: string;

  lastName: string;

  fullName: string;

  roleId: number;

  token?: string;

  roleName: string;

  permissions: IRolePermissionDTO[];
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
