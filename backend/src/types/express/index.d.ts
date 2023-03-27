import { Permission } from "@enums/Permission";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      // @NOTE - available only after validateToken middleware
      userId: number;

      permissions?: { [key in Permission]?: boolean };
    }
  }
}
