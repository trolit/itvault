import { Response } from "express";
import { DataStore } from "types/DataStore";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IDataStoreService } from "types/services/IDataStoreService";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { DeleteSessionControllerTypes } from "types/controllers/Auth/DeleteSessionController";

import { Di } from "@enums/Di";
import { Service } from "@enums/Service";

import { composeDataStoreKey } from "@helpers/composeDataStoreKey";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class DeleteSessionController extends BaseController {
  constructor(
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
    request: DeleteSessionControllerTypes.v1.Request,
    response: Response
  ) {
    const {
      userId,
      params: { id: sessionId },
    } = request;

    const key: DataStore.Key = [
      `${userId}-${sessionId}`,
      DataStore.KeyType.AuthenticatedUser,
    ];

    // @TODO prevent deleting session from which request was fired because this is logout..

    // @TODO lets move it to AuthService?
    try {
      const keyCount = await this._dataStoreService.isKeyDefined(key);

      if (keyCount === 1) {
        await this._dataStoreService.delete(key);
      }
    } catch (error) {
      log.error({
        error,
        message: `Failed to delete session identified by '${composeDataStoreKey(
          key
        )}'`,
        service: Service.Redis,
      });
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
