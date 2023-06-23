import { inject, injectable } from "tsyringe";
import { PaginatedResult } from "types/Result";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Blueprint } from "@entities/Blueprint";
import { IController } from "@interfaces/IController";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

interface IParams {
  workspaceId: number;
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
      params: { workspaceId },
      query: { skip, take },
    } = request;

    const [result, total] = await this._blueprintRepository.getAll({
      skip,
      take,
      where: {
        workspace: {
          id: workspaceId,
        },
      },
    });

    return response.status(HTTP.OK).send({ result, total });
  }
}
