import { RequestPermissions } from "@utils/types";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      // @NOTE --- available only after `requirePermissions` middleware
      userId: number;

      // @NOTE --- available only after `requirePermissions` middleware
      permissions: RequestPermissions;
    }
  }
}
