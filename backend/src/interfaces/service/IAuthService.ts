import { SignOptions, VerifyErrors } from "jsonwebtoken";

import { JwtPayload } from "@utils/JwtPayload";

type IVerifyTokenResult =
  | {
      error: VerifyErrors;
      payload?: undefined;
    }
  | { payload: JwtPayload; error?: undefined };

export interface IAuthService {
  signToken(payload: JwtPayload, options?: SignOptions): string;

  verifyToken(token: string): IVerifyTokenResult;
}
