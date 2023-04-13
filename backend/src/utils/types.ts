import { ZodSchema } from "zod";
import { Request, Response } from "express";

import { Permission } from "@enums/Permission";

// @NOTE https://stackoverflow.com/questions/39622778/what-is-new-in-typescript
export type Type<T> = new (...args: unknown[]) => T;

export type CustomRequest<P = void, B = void, Q = void> = Request<
  P,
  unknown,
  B,
  Q
>;

export type CustomResponse<T> = Response<T, Record<string, T>>;

export type ParseableRequestContent = Partial<{
  body: { withSchema: ZodSchema };
  query: { withSchema: ZodSchema };
  params: { withSchema: ZodSchema };
}>;

export type RequestPermissions = { [key in Permission]?: boolean };
