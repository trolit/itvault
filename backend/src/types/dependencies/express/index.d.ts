import formidable from "formidable";

import { IFormDataFile } from "@interfaces/IFormDataFile";
import { RequestPermissions } from "";

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

  export type CustomRequest<P = void, B = void, Q = void> = Request<
    P,
    unknown,
    B,
    Q
  >;

  export type CustomResponse<T> = Response<T, Record<string, T>>;

  export type RequestPermissions = { [key in Permission]?: boolean };
}
