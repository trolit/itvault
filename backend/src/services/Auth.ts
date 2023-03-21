import jwt from "jsonwebtoken";
import type { SignOptions, VerifyErrors } from "jsonwebtoken";

import { JwtPayloadDto } from "@dtos/JwtPayload";
import { JWT_SECRET_KEY, JWT_TOKEN_LIFETIME } from "@config";

export class AuthService {
  signToken(payload: JwtPayloadDto, options: SignOptions = {}) {
    return jwt.sign(payload, JWT_SECRET_KEY, {
      ...options,
      expiresIn: JWT_TOKEN_LIFETIME,
    });
  }

  verifyToken(token: string) {
    const result: {
      content?: JwtPayloadDto;

      error?: VerifyErrors;
    } = {};

    jwt.verify(
      token,
      JWT_SECRET_KEY,
      {
        algorithms: ["HS256"],
      },
      (error: VerifyErrors | null, decodedContent: unknown) => {
        if (!error) {
          result.content = <JwtPayloadDto>decodedContent;
        } else {
          result.error = error;
        }
      }
    );

    return result;
  }
}
