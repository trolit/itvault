import { IsNull, Like, Not } from "typeorm";
import { inject, injectable } from "tsyringe";
import { Blueprint } from "@db/entities/Blueprint";
import { StatusCodes as HTTP } from "http-status-codes";
import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";
import { GetAllControllerTypes } from "types/controllers/Blueprint/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static readonly ALL_VERSIONS = [v1];

  async v1(
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      query: { skip, take, workspaceId, inUse, name },
    } = request;

    // @TMP, consider implementing "flexible filtering" later
    const bucketsQuery = inUse === 1 ? { buckets: { id: Not(IsNull()) } } : {};
    const nameQuery = name ? { name: Like(`%${name}%`) } : {};

    const [result, total] = await this._blueprintRepository.getAllAndCount({
      skip,
      take,
      order: {
        pinnedAt: "desc",
      },
      where: {
        ...nameQuery,
        workspace: {
          id: workspaceId,
        },
        ...bucketsQuery,
      },
    });

    const mappedResult = this.mapper.map<Blueprint>(result).to(BlueprintMapper);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
