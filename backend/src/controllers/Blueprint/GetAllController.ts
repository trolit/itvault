import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Blueprint } from "@entities/Blueprint";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";
import {
  PaginatedResponse,
  ControllerImplementation,
} from "miscellaneous-types";

import { BaseController } from "@controllers/BaseController";

type Query = {
  workspaceId: number;
} & IPaginationOptions;

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
    request: CustomRequest<undefined, undefined, Query>,
    response: CustomResponse<PaginatedResponse<Blueprint>>
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
