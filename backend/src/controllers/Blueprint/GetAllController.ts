import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { PaginatedResult } from "@utils/Result";
import { Blueprint } from "@entities/Blueprint";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IBlueprintRepository } from "@interfaces/repository/IBlueprintRepository";

interface IParams {
  id: number;
}

interface IQuery {
  skip: number;

  take: number;
}

@injectable()
export class GetAllController
  implements
    IController<IParams, undefined, IQuery, PaginatedResult<Blueprint>>
{
  constructor(
    @inject(Di.BlueprintRepository)
    private _blueprintRepository: IBlueprintRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams, undefined, IQuery>,
    response: CustomResponse<PaginatedResult<Blueprint>>
  ) {
    const {
      params: { id },
      query: { skip, take },
    } = request;

    const [result, total] =
      await this._blueprintRepository.findAllByWorkspaceId(id, {
        pagination: { skip, take },
      });

    return response.status(HTTP.OK).send({ result, total });
  }
}
