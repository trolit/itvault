import { Like, Not } from "typeorm";
import { Role } from "@db/entities/Role";
import { inject, injectable } from "tsyringe";
import { RoleMapper } from "@mappers/RoleMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IRoleRepository } from "types/repositories/IRoleRepository";
import { GetAllControllerTypes } from "types/controllers/Role/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      query: { skip, take, name },
    } = request;

    const nameQuery = name ? { name: Like(`%${name}%`) } : {};

    const [result, total] = await this._roleRepository.getAllAndCount({
      skip,
      take,
      where: {
        id: Not(HEAD_ADMIN_ROLE.id),
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
