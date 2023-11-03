import { inject, injectable } from "tsyringe";
import { RoleMapper } from "@mappers/RoleMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IRoleRepository } from "types/repositories/IRoleRepository";
import { GetAllControllerTypes } from "types/controllers/Role/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetPermissionsControllerTypes } from "types/controllers/Role/GetPermissionsController";

import { Di } from "@enums/Di";
import { Role } from "@entities/Role";
import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

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
        id,
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

    const mappedResult = this.mapper.map<Role>(role).to(RoleMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedResult.permissions);
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
