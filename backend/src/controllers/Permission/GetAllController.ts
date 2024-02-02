import { inject, injectable } from "tsyringe";
import { Permission } from "@db/entities/Permission";
import { StatusCodes as HTTP } from "http-status-codes";
import { PermissionMapper } from "@mappers/PermissionMapper";
import { IPermissionRepository } from "types/repositories/IPermissionRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetAllControllerTypes } from "types/controllers/Permission/GetAllController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.PermissionRepository)
    private _permissionRepository: IPermissionRepository
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
    const permissions = await this._permissionRepository.getAll({});

    const mappedResult = this.mapper
      .map<Permission>(permissions)
      .to(PermissionMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedResult);
  }
}
