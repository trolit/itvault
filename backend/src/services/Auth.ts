import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { JwtPayloadDto } from "@dtos/JwtPayload";
import { JWT_SECRET_KEY, JWT_TOKEN_LIFETIME } from "@config";

export class AuthService {
  signToken(payload: JwtPayloadDto, options: SignOptions = {}) {
    return jwt.sign(payload, JWT_SECRET_KEY, {
      ...options,
      expiresIn: JWT_TOKEN_LIFETIME,
    });
  }

  decodeToken(token: string) {
    return jwt.decode(token);
  }

  isTokenValid(token: string) {
    const isValid = jwt.verify(token, JWT_SECRET_KEY);

    return !!isValid;
  }
}
