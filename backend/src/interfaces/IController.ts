import { Request, Response } from "express";

export interface IController {
  invoke(request: Request, response: Response): Promise<Response>;
}
