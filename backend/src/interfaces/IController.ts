import { Request, Response } from "express";

export interface IController<Q = void, B = void, R = void> {
  invoke(
    request: Request<unknown, unknown, B, Q>,
    response: Response<R, Record<string, R>>
  ): Promise<Response>;
}
