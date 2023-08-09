import assert from "assert";
import { inject, injectable } from "tsyringe";
import { RoleMapper } from "@mappers/RoleMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IRoleService } from "types/services/IRoleService";
import { StoreControllerTypes } from "types/controllers/Role/StoreController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

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
    request: StoreControllerTypes.v1.Request,
    response: StoreControllerTypes.v1.Response
  ) {
    const { body } = request;

    const result = await this._roleService.create(body);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    assert(result.value);

    const mappedResult = this.mapper.map(result.value).to(RoleMapper);

    return this.finalizeRequest(response, HTTP.CREATED, mappedResult);
  }
}
