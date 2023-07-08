import { inject, injectable } from "tsyringe";
import { PaginatedResult } from "types/Result";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Blueprint } from "@entities/Blueprint";
import { ControllerImplementation } from "miscellaneous-types";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  workspaceId: number;
}

interface IQuery {
  skip: number;

  take: number;
}

const version1 = 1;

@injectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.BlueprintRepository)
    private _blueprintRepository: IBlueprintRepository
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: version1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [version1];

  async v1(
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

    return this.finalizeRequest(response, HTTP.OK, { result, total });
  }
}
