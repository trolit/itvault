import { And, Not } from "typeorm";
import { inject, injectable } from "tsyringe";
import { UserMapper } from "@mappers/UserMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IUserRepository } from "types/repositories/IUserRepository";
import { GetAllControllerTypes } from "types/controllers/User/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Di } from "@enums/Di";
import { User } from "@entities/User";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllController extends BaseController {
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
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      userId,
      query: { skip, take, filters },
    } = request;

    const workspaceIdQuery = filters.workspaceId
      ? {
          workspaceId: filters.workspaceId,
        }
      : {};

    const [result, total] = await this._userRepository.getAllAndCount({
      skip,
      take,
      order: {
        email: "asc",
      },
      relations: {
        role: true,
        createdBy: true,
      },
      where: {
        id:
          userId === HEAD_ADMIN_ROLE_ID
            ? Not(HEAD_ADMIN_ROLE_ID)
            : And(Not(HEAD_ADMIN_ROLE_ID), Not(userId)),
        userToWorkspace: {
          ...workspaceIdQuery,
        },
      },
      withDeleted: true,
    });

    const mappedResult = this.mapper.map<User>(result).to(UserMapper);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
