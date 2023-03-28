import { ZodSchema } from "zod";
import { Request, Response } from "express";

export type RequestOfType<T> = Request<unknown, unknown, T>;

export type RequestWithQuery<T> = Request<unknown, unknown, unknown, T>;

// @NOTE https://stackoverflow.com/questions/39622778/what-is-new-in-typescript
export type Type<T> = new (...args: unknown[]) => T;

export type CustomRequest<B = void, Q = void> = Request<unknown, unknown, B, Q>;

export type CustomResponse<T> = Response<T, Record<string, T>>;

export type ParseableRequestContent = Partial<{
  body: { withSchema: ZodSchema };
  query: { withSchema: ZodSchema };
}>;
