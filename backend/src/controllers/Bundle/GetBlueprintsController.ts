import { inject, injectable } from "tsyringe";
import { Blueprint } from "@db/entities/Blueprint";
import { StatusCodes as HTTP } from "http-status-codes";
import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetBlueprintsControllerTypes } from "types/controllers/Bundle/GetBlueprintsController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetBlueprintsController extends BaseController {
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

  static ALL_VERSIONS = [v1];

  async v1(
    request: GetBlueprintsControllerTypes.v1.Request,
    response: GetBlueprintsControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { workspaceId },
    } = request;

    const blueprints = await this._blueprintRepository.getAll({
      where: {
        workspace: {
          id: workspaceId,
        },
        blueprintToBundle: {
          bundle: {
            id,
          },
        },
      },
    });

    const result = this.mapper.map<Blueprint>(blueprints).to(BlueprintMapper);

    return this.finalizeRequest(response, HTTP.OK, result);
  }
}
