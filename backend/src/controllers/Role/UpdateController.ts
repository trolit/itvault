import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IRoleService } from "types/services/IRoleService";
import { UpdateControllerTypes } from "types/controllers/Role/UpdateController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateController extends BaseController {
  constructor(
    @inject(Di.RoleService)
    private _roleService: IRoleService
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
    request: UpdateControllerTypes.v1.Request,
    response: UpdateControllerTypes.v1.Response
  ) {
    const {
      userId,
      params: { id },
      body,
    } = request;

    const result = await this._roleService.update(id, userId, body);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
