import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Workspace } from "@entities/Workspace";
import { ControllerImplementation } from "miscellaneous-types";
import { IWorkspaceRepository } from "@interfaces/repositories/IWorkspaceRepository";

import { BaseController } from "@controllers/BaseController";

interface IQuery {
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
    request: CustomRequest<undefined, IBody, IQuery>,
    response: CustomResponse<Workspace>
  ) {
    const {
      query: { id },
      body: { name, tags },
    } = request;

    const result = await this._workspaceRepository.update(id, name, tags);

    if (!result?.affected) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
