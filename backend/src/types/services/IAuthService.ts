import { Response } from "express";
import { DataStore } from "types/DataStore";
import { JwtPayload, SignOptions, VerifyTokenResult } from "jsonwebtoken";

export interface IAuthService {
  signIn(payload: JwtPayload, options?: SignOptions): string;

  signOut(token: string, response: Response): Promise<number>;

  verifyToken(token: string): VerifyTokenResult;

  getRoleFromDataStore(roleId: number): Promise<DataStore.Role | null>;
}
