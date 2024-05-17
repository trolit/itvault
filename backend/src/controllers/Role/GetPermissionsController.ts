import { And, Equal, Not } from "typeorm";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { PermissionToRole } from "@db/entities/PermissionToRole";
import { IRoleRepository } from "types/repositories/IRoleRepository";
import { RolePermissionMapper } from "@mappers/RolePermissionMapper";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetPermissionsControllerTypes } from "types/controllers/Role/GetPermissionsController";

import { Di } from "@enums/Di";
import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetPermissionsController extends BaseController {
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

  static readonly ALL_VERSIONS = [v1];

  async v1(
    request: GetPermissionsControllerTypes.v1.Request,
    response: GetPermissionsControllerTypes.v1.Response
  ) {
    const {
      params: { id },
    } = request;

    const role = await this._roleRepository.getOne({
      select: {
        id: true,
        permissionToRole: true,
      },
      where: {
        id: And(Equal(id), Not(HEAD_ADMIN_ROLE.id)),
      },
      relations: {
        permissionToRole: {
          permission: true,
        },
      },
    });

    if (!role) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    const result = this.mapper
      .map<PermissionToRole>(role.permissionToRole)
      .to(RolePermissionMapper);

    return this.finalizeRequest(response, HTTP.OK, result);
  }
}
