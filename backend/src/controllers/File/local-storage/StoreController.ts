import { injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { PaginatedResult } from "@utils/Result";
import { Blueprint } from "@entities/Blueprint";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";

interface IParams {
  id: number;
}

@injectable()
export class StoreController
  implements
    IController<IParams, undefined, undefined, PaginatedResult<Blueprint>>
{
  async invoke(
    request: CustomRequest<IParams>,
    response: CustomResponse<PaginatedResult<Blueprint>>
  ) {
    // @TODO handle request

    return response.status(HTTP.NO_CONTENT).send();
  }
}
