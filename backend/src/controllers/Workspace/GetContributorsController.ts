import { IsNull, Not } from "typeorm";
import { User } from "@db/entities/User";
import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { ContributorMapper } from "@mappers/ContributorMapper";
import { IUserRepository } from "types/repositories/IUserRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetContributorsControllerTypes } from "types/controllers/Workspace/GetContributorsController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@autoInjectable()
export class GetContributorsController extends BaseController {
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
    request: GetContributorsControllerTypes.v1.Request,
    response: GetContributorsControllerTypes.v1.Response
  ) {
    const {
      params: { id },
    } = request;

    const data = await this._userRepository.getAll({
      where: {
        workspaceEvents: {
          id: Not(IsNull()),
          workspace: {
            id,
          },
        },
      },
    });

    const contributors = this.mapper.map<User>(data).to(ContributorMapper);

    return this.finalizeRequest(response, HTTP.OK, contributors);
  }
}
