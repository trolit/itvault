import { Response } from "express";
import { JwtPayload, SignOptions, VerifyTokenResult } from "jsonwebtoken";

import { DataStoreRole } from "data-store-types";

export interface IAuthService {
  signIn(payload: JwtPayload, options?: SignOptions): string;

  signOut(token: string, response: Response): Promise<number>;

  verifyToken(token: string): VerifyTokenResult;

  getSignedUserRole(userId: number): Promise<DataStoreRole | null>;
}
