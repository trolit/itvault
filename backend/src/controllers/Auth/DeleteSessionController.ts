import { Response } from "express";
import { DataStore } from "types/DataStore";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IDataStoreService } from "types/services/IDataStoreService";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { DeleteSessionControllerTypes } from "types/controllers/Auth/DeleteSessionController";

import { Di } from "@enums/Di";
import { Service } from "@enums/Service";

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

    try {
      const session = await this._dataStoreService.get<DataStore.User>(key);

      if (session) {
        await this._dataStoreService.deleteHash(key);
      }
    } catch (error) {
      log.error({
        error,
        message: `Failed to delete session identified by '${key}'`,
        service: Service.Redis,
      });
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
