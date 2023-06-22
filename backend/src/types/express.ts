declare module "@custom-types/express" {
  import { Request, Response } from "express";
  import { Permission } from "types/enums/Permission";

  export type CustomRequest<P = void, B = void, Q = void> = Request<
    P,
    unknown,
    B,
    Q
  >;

  export type CustomResponse<T> = Response<T, Record<string, T>>;

  export type RequestPermissions = { [key in Permission]?: boolean };
}
