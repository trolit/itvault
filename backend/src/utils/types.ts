import { ZodSchema } from "zod";
import { Request, Response } from "express";

import { Permission } from "@enums/Permission";
import { ISuperSchemaParams } from "@interfaces/ISuperSchemaParams";
import { ISuperSchemaProperties } from "@interfaces/ISuperSchemaProperties";

// @NOTE https://stackoverflow.com/questions/39622778/what-is-new-in-typescript
export type Type<T> = new (...args: unknown[]) => T;

export type CustomRequest<P = void, B = void, Q = void> = Request<
  P,
  unknown,
  B,
  Q
>;

export type CustomResponse<T> = Response<T, Record<string, T>>;

export type RequestPermissions = { [key in Permission]?: boolean };

type SuperSchemaRunner = () => (ZodSchema | null) | Promise<ZodSchema | null>;

export type SuperSchema = (
  commonParams: ISuperSchemaParams
) => Promise<Partial<Record<keyof ISuperSchemaProperties, SuperSchemaRunner>>>;
