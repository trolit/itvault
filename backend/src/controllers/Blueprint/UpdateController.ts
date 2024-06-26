import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";
import { UpdateControllerTypes } from "types/controllers/Blueprint/UpdateController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { getOptionsOfTraceRelatedEntity } from "@helpers/getOptionsOfTraceRelatedEntity";

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

  static readonly ALL_VERSIONS = [v1];

  async v1(request: UpdateControllerTypes.v1.Request, response: Response) {
    const {
      body,
      userId,
      params: { id },
      query: { workspaceId },
    } = request;

    const blueprint = await this._blueprintRepository.getOne({
      where: {
        id,
        workspace: { id: workspaceId },
      },
      relations: {
        workspace: true,
      },
    });

    if (!blueprint) {
      return response.status(HTTP.NOT_FOUND);
    }

    // @TODO should do like with Note - "update any blueprint" or update if owner

    await this._blueprintRepository.primitiveSave(
      {
        ...blueprint,
        ...body,
        updatedBy: {
          id: userId,
        },
      },
      getOptionsOfTraceRelatedEntity({
        userId,
        workspaceId,
      })
    );

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
