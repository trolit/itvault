import { IsNull, Not } from "typeorm";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";
import { UnpinControllerTypes } from "types/controllers/Workspace/UnpinController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UnpinController extends BaseController {
  constructor(
    @inject(Di.WorkspaceRepository)
    private _workspaceRepository: IWorkspaceRepository
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
    request: UnpinControllerTypes.v1.Request,
    response: UnpinControllerTypes.v1.Response
  ) {
    const {
      params: { id },
    } = request;

    const result = await this._workspaceRepository.primitiveUpdate(
      { id, pinnedAt: Not(IsNull()) },
      { pinnedAt: null }
    );

    if (!result.affected) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    return this.finalizeRequest(response, HTTP.OK);
  }
}
