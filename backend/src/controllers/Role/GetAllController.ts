import { Not } from "typeorm";
import { inject, injectable } from "tsyringe";
import { RoleMapDto } from "@mappers/RoleMapDto";
import { StatusCodes as HTTP } from "http-status-codes";
import { GetAllControllerTypes } from "types/controllers/Role/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { IRoleRepository } from "@interfaces/repositories/IRoleRepository";

import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

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
      query: { skip, take },
    } = request;

    const [result, total] = await this._roleRepository.getAll({
      skip,
      take,
      where: {
        id: Not(HEAD_ADMIN_ROLE_ID),
      },
    });

    const mappedResult = this.mapper.mapToDto(result, RoleMapDto);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }

  static isMissingPermissions(
    request: CustomRequest<void, void, GetAllControllerTypes.v1.QueryInput>
  ) {
    const { permissions } = request;

    return (
      !isPermissionEnabled(Permission.CreateRole, permissions) &&
      !isPermissionEnabled(Permission.UpdateRole, permissions)
    );
  }
}
