import { Like, Not } from "typeorm";
import { inject, injectable } from "tsyringe";
import { RoleMapper } from "@mappers/RoleMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IRoleRepository } from "types/repositories/IRoleRepository";
import { GetAllControllerTypes } from "types/controllers/Role/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Di } from "@enums/Di";
import { Role } from "@entities/Role";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.RoleRepository)
    private _roleRepository: IRoleRepository
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
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      query: { skip, take, name },
    } = request;

    const nameQuery = name ? { name: Like(`%${name}%`) } : {};

    const [result, total] = await this._roleRepository.getAllAndCount({
      skip,
      take,
      where: {
        id: Not(HEAD_ADMIN_ROLE_ID),
        ...nameQuery,
      },
      relations: {
        createdBy: true,
        updatedBy: true,
      },
    });

    const mappedResult = this.mapper.map<Role>(result).to(RoleMapper);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
