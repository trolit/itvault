import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Workspace } from "@entities/Workspace";
import { ControllerImplementation } from "miscellaneous-types";
import { IWorkspaceRepository } from "@interfaces/repositories/IWorkspaceRepository";

import { BaseController } from "@controllers/BaseController";

export interface IBody {
  name: string;

  tags: string[];
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
  constructor(
    @inject(Di.WorkspaceRepository)
    private _workspaceRepository: IWorkspaceRepository
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
    request: CustomRequest<undefined, IBody>,
    response: CustomResponse<Workspace>
  ) {
    const {
      body: { name, tags },
    } = request;

    const workspace = await this._workspaceRepository.primitiveSave({
      name,
      tags: tags.map(tag => ({ value: tag })),
    });

    if (!workspace) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    return this.finalizeRequest(response, HTTP.CREATED, workspace);
  }
}
