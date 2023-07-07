import { Request, Response } from "express";

export interface IBaseController {
  invoke(request: Request, response: Response): Promise<CustomResponse<any>>;
}
