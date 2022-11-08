import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "@config";

export class AuthService {
  isTokenValid(token: string) {
    const isValid = jwt.verify(token, JWT_SECRET_KEY);

    return !!isValid;
  }
}
