import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { IWorkspaceService } from "@interfaces/services/IWorkspaceService";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  id: number;
}

export interface IBody {
  name: string;

  tags: string[];
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(
    request: CustomRequest<IParams, IBody>,
    response: CustomResponse<undefined | string>
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
