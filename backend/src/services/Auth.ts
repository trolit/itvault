import jwt from "jsonwebtoken";
import { injectable } from "tsyringe";

import { JWT_SECRET_KEY } from "@config";

@injectable()
export class AuthService {
  isTokenValid(token: string) {
    const isValid = jwt.verify(token, JWT_SECRET_KEY);

    return !!isValid;
  }
}
