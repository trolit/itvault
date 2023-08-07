import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { BlueprintMapDto } from "@mappers/BlueprintMapDto";
import { GetAllControllerTypes } from "types/controllers/Blueprint/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { BaseController } from "@controllers/BaseController";

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
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
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

    const mappedResult = this.mapper.mapToDto(result, BlueprintMapDto);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
