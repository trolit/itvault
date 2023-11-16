import { IsNull } from "typeorm";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IDateService } from "types/services/IDateService";
import { PinControllerTypes } from "types/controllers/Workspace/PinController";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class PinController extends BaseController {
  constructor(
    @inject(Di.WorkspaceRepository)
    private _workspaceRepository: IWorkspaceRepository,
    @inject(Di.DateService)
    private _dateService: IDateService
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
    request: PinControllerTypes.v1.Request,
    response: PinControllerTypes.v1.Response
  ) {
    const {
      params: { id },
    } = request;

    const result = await this._workspaceRepository.primitiveUpdate(
      { id, pinnedAt: IsNull() },
      { pinnedAt: this._dateService.now().toISOString() }
    );

    if (!result.affected) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    return this.finalizeRequest(response, HTTP.OK);
  }
}
