import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IWorkspaceService } from "types/services/IWorkspaceService";
import { UpdateControllerTypes } from "types/controllers/Workspace/UpdateController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateController extends BaseController {
  constructor(
    @inject(Di.WorkspaceService)
    private _workspaceService: IWorkspaceService
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
    request: UpdateControllerTypes.v1.Request,
    response: UpdateControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      body,
    } = request;

    const result = await this._workspaceService.update(id, body);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
