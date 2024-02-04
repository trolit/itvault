import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";
import { UpdateControllerTypes } from "types/controllers/Blueprint/UpdateController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateController extends BaseController {
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

  async v1(request: UpdateControllerTypes.v1.Request, response: Response) {
    const {
      body,
      userId,
      params: { id },
      query: { workspaceId },
    } = request;

    const result = await this._blueprintRepository.primitiveUpdate(
      {
        id,
        workspace: { id: workspaceId },
        updatedBy: {
          id: userId,
        },
      },
      body
    );

    if (!result?.affected) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
