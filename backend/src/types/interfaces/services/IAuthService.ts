import { Response } from "express";
import { JwtPayload, SignOptions, VerifyErrors } from "jsonwebtoken";

import { DataStoreRole } from "@dataStore";

type VerifyTokenResult =
  | {
      error: VerifyErrors;
      payload?: undefined;
    }
  | { payload: JwtPayload; error?: undefined };

export interface IAuthService {
  signIn(payload: JwtPayload, options?: SignOptions): string;

  signOut(token: string, response: Response): Promise<number>;

  verifyToken(token: string): VerifyTokenResult;

  getSignedUserRole(userId: number): Promise<DataStoreRole | null>;
}
