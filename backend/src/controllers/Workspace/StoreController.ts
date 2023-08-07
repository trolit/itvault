import assert from "assert";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { WorkspaceMapDto } from "@mappers/WorkspaceMapDto";
import { StoreControllerTypes } from "types/controllers/Workspace/StoreController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { IWorkspaceService } from "@interfaces/services/IWorkspaceService";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
  constructor(
    @inject(Di.WorkspaceService)
    private _workspaceService: IWorkspaceService
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
    request: StoreControllerTypes.v1.Request,
    response: StoreControllerTypes.v1.Response
  ) {
    const { body } = request;

    const result = await this._workspaceService.create(body);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    assert(result.value);

    const mappedResult = this.mapper.mapOneToDto(result.value, WorkspaceMapDto);

    return this.finalizeRequest(response, HTTP.CREATED, mappedResult);
  }
}
