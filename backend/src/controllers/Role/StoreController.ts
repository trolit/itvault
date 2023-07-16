import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Role } from "@entities/Role";
import { AddEditRoleDto } from "@dtos/AddEditRoleDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IRoleService } from "@interfaces/services/IRoleService";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
  constructor(
    @inject(Di.RoleService)
    private _roleService: IRoleService
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
    request: CustomRequest<undefined, AddEditRoleDto>,
    response: CustomResponse<Role | string>
  ) {
    const { body } = request;

    const result = await this._roleService.create(body);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    return this.finalizeRequest(response, HTTP.CREATED, result.value);
  }
}
