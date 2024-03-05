import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";
import { AddControllerTypes } from "types/controllers/Blueprint/AddController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class AddController extends BaseController {
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
    request: AddControllerTypes.v1.Request,
    response: AddControllerTypes.v1.Response
  ) {
    const {
      body,
      userId,
      query: { workspaceId },
    } = request;

    const blueprint = await this._blueprintRepository.primitiveSave(
      {
        ...body,
        workspace: {
          id: workspaceId,
        },
        createdBy: {
          id: userId,
        },
        updatedBy: {
          id: userId,
        },
      },
      {
        userId,
      }
    );

    if (!blueprint) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    const result = this.mapper.map(blueprint).to(BlueprintMapper);

    return this.finalizeRequest(response, HTTP.CREATED, result);
  }
}
