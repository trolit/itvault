import { Response } from "express";
import { SignOptions, VerifyErrors } from "jsonwebtoken";

import { JwtPayload } from "@utils/JwtPayload";
import { DataStoreUser } from "@utils/DataStoreUser";
import { DataStoreRole } from "@utils/DataStoreRole";

type IVerifyTokenResult =
  | {
      error: VerifyErrors;
      payload?: undefined;
    }
  | { payload: JwtPayload; error?: undefined };

export interface IAuthService {
  signToken(payload: JwtPayload, options?: SignOptions): string;

  verifyToken(token: string): IVerifyTokenResult;

  signOut(token: string, response: Response): Promise<number>;

  findLoggedUserData(
    userId: number
  ): Promise<[DataStoreUser, DataStoreRole] | null>;
}
