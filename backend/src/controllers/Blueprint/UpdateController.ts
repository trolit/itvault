import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { UpdateControllerTypes } from "types/controllers/Blueprint/UpdateController";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(request: UpdateControllerTypes.v1.Request, response: Response) {
    const {
      body,
      params: { id },
      query: { workspaceId },
    } = request;

    const result = await this._blueprintRepository.primitiveUpdate(
      {
        id,
        workspace: { id: workspaceId },
      },
      body
    );

    if (!result?.affected) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
