import { Response } from "express";
import { SignOptions, VerifyErrors } from "jsonwebtoken";

import { JwtPayload } from "@utils/JwtPayload";
import { DataStoreRole } from "@utils/DataStoreRole";

type IVerifyTokenResult =
  | {
      error: VerifyErrors;
      payload?: undefined;
    }
  | { payload: JwtPayload; error?: undefined };

export interface IAuthService {
  signIn(payload: JwtPayload, options?: SignOptions): string;

  signOut(token: string, response: Response): Promise<number>;

  verifyToken(token: string): IVerifyTokenResult;

  getSignedUserRole(userId: number): Promise<DataStoreRole | null>;
}
