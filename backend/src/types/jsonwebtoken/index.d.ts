import jwt, { JwtPayload as IJwtPayload } from "jsonwebtoken";

declare module "jsonwebtoken" {
  export class JwtPayload implements IJwtPayload {
    id: number;

    email: string;
  }
}
