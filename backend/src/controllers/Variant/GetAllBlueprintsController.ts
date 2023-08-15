import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetAllBlueprintsControllerTypes } from "types/controllers/Variant/GetAllBlueprintsController";

import { Di } from "@enums/Di";
import { Blueprint } from "@entities/Blueprint";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetContentByIdController extends BaseController {
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
    request: GetAllBlueprintsControllerTypes.v1.Request,
    response: GetAllBlueprintsControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { workspaceId },
    } = request;

    const [blueprints] = await this._blueprintRepository.getAll({
      where: {
        workspace: {
          id: workspaceId,
        },
        buckets: {
          variant: {
            id,
          },
        },
      },
    });

    const mappedBlueprints = this.mapper
      .map<Blueprint>(blueprints)
      .to(BlueprintMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedBlueprints);
  }
}
