import formidable from "formidable";

import { IFormDataFile } from "@interfaces/IFormDataFile";
import { RequestPermissions } from "@custom-types/express";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      // @NOTE --- available only after `requireAuthentication` middleware
      userId: number;

      // @NOTE --- available only after `requireAuthentication` middleware
      permissions: RequestPermissions;

      // @NOTE --- available only after `parseWorkspaceFormData` middleware
      files: IFormDataFile[];
    }
  }
}
