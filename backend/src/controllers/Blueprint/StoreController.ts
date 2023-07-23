import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Blueprint } from "@entities/Blueprint";
import { ControllerImplementation } from "miscellaneous-types";
import { AddEditBlueprintDto } from "@dtos/AddEditBlueprintDto";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { BaseController } from "@controllers/BaseController";

export interface IQuery {
  workspaceId: number;
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
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
    request: CustomRequest<undefined, AddEditBlueprintDto, IQuery>,
    response: CustomResponse<Blueprint>
  ) {
    const {
      body,
      query: { workspaceId },
    } = request;

    const blueprint = await this._blueprintRepository.primitiveSave({
      ...body,
      workspace: {
        id: workspaceId,
      },
    });

    if (!blueprint) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return this.finalizeRequest(response, HTTP.CREATED, blueprint);
  }
}
