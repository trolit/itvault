import { Response } from "express";
import { DataStore } from "types/DataStore";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IDataStoreService } from "types/services/IDataStoreService";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { DeleteSessionControllerTypes } from "types/controllers/User/DeleteSessionController";

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
      params: { id, sessionId },
    } = request;

    const key = composeDataStoreKey([
      `${id}-${sessionId}`,
      DataStore.KeyType.AuthenticatedUser,
    ]);

    try {
      await this._dataStoreService.deleteHash([
        `${id}-${sessionId}`,
        DataStore.KeyType.AuthenticatedUser,
      ]);
    } catch (error) {
      log.error({
        error,
        message: `Failed to delete hash identified by '${key}'`,
        service: Service.Redis,
      });
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
