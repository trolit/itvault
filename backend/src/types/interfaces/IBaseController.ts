import { Request, Response } from "express";

export interface IBaseController {
  invoke(
    request: CustomRequest<void>,
    response: Response
  ): Promise<CustomResponse<any>>;
}
