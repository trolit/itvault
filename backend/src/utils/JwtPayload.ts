import { JwtPayload as IJwtPayload } from "jsonwebtoken";

export class JwtPayload implements IJwtPayload {
  id: number;

  email: string;
}
