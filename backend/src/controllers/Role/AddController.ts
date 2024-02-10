import assert from "assert";
import { DataStore } from "types/DataStore";
import { inject, injectable } from "tsyringe";
import { RoleMapper } from "@mappers/RoleMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IRoleService } from "types/services/IRoleService";
import { IDataStoreService } from "types/services/IDataStoreService";
import { AddControllerTypes } from "types/controllers/Role/AddController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class AddController extends BaseController {
  constructor(
    @inject(Di.RoleService)
    private _roleService: IRoleService,
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
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
    request: AddControllerTypes.v1.Request,
    response: AddControllerTypes.v1.Response
  ) {
    const { userId, body } = request;

    const result = await this._roleService.create(userId, body);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    assert(result.value);

    const { id } = result.value;

    const key: DataStore.Key = [id, DataStore.KeyType.Role];

    try {
      await this._dataStoreService.set<DataStore.Role>(key, {
        id,
        permissions: body.permissions,
      });
    } catch (error) {
      log.error({
        error,
        message: `Failed to include new role '${key}'!!`,
        dependency: Dependency.Redis,
      });
    }

    const mappedResult = this.mapper.map(result.value).to(RoleMapper);

    return this.finalizeRequest(response, HTTP.CREATED, mappedResult);
  }
}
