import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { PaginatedResult } from "types/TransactionResult";

import { Di } from "@enums/Di";
import { Blueprint } from "@entities/Blueprint";
import { ControllerImplementation } from "miscellaneous-types";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { BaseController } from "@controllers/BaseController";

interface IQuery {
  skip: number;

  take: number;

  workspaceId: number;
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(
    request: CustomRequest<undefined, undefined, IQuery>,
    response: CustomResponse<PaginatedResult<Blueprint>>
  ) {
    const {
      query: { skip, take, workspaceId },
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
