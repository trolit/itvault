import { Request, Response } from "express";

export type RequestOfType<T> = Request<unknown, unknown, T>;

export type RequestWithQuery<T> = Request<unknown, unknown, unknown, T>;

export type ResponseOfType<T> = Response<T, Record<string, T>>;
