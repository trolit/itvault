import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IUserRepository } from "types/repositories/IUserRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { UpdateWorkspacesAccessControllerTypes } from "types/controllers/User/UpdateWorkspacesAccessController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateWorkspacesAccessController extends BaseController {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository
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
    request: UpdateWorkspacesAccessControllerTypes.v1.Request,
    response: UpdateWorkspacesAccessControllerTypes.v1.Response
  ) {
    const {
      body: { ids },
      query: { userId },
    } = request;

    const result = await this._userRepository.updateWorkspacesAccess(
      userId,
      ids
    );

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
