import jwt from "jsonwebtoken";
import type { SignOptions, VerifyErrors } from "jsonwebtoken";

import { JwtPayload } from "@utilities/JwtPayload";
import { IAuthService } from "@interfaces/IAuthService";
import { JWT_SECRET_KEY, JWT_TOKEN_LIFETIME } from "@config";

export class AuthService implements IAuthService {
  signToken(payload: JwtPayload, options: SignOptions = {}) {
    return jwt.sign(payload, JWT_SECRET_KEY, {
      ...options,
      expiresIn: JWT_TOKEN_LIFETIME,
    });
  }

  verifyToken(token: string) {
    let verificationError: VerifyErrors | null = null;
    let payload: JwtPayload = { id: -1, email: "" };

    jwt.verify(
      token,
      JWT_SECRET_KEY,
      {
        algorithms: ["HS256"],
      },
      (error: VerifyErrors | null, decodedContent: unknown) => {
        if (!error) {
          payload = <JwtPayload>decodedContent;
        } else {
          verificationError = error;
        }
      }
    );

    if (verificationError) {
      return {
        error: verificationError,
      };
    }

    return {
      payload,
    };
  }
}
