import { Request, Response } from "express";

export type RequestOfType<T> = Request<unknown, unknown, T>;

export type ResponseOfType<T> = Response<T, Record<string, T>>;

// @NOTE https://stackoverflow.com/questions/39622778/what-is-new-in-typescript
export type Type<T> = new (...args: unknown[]) => T;
