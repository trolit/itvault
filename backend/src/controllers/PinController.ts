import { IsNull } from "typeorm";
import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IDateService } from "types/services/IDateService";
import { IBaseRepository } from "types/repositories/IBaseRepository";
import { PinControllerTypes } from "types/controllers/PinController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { BaseController } from "./BaseController";

import { Di } from "@enums/Di";

import { getRepositoryByOriginalUrl } from "@helpers/getRepositoryByOriginalUrl";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class PinController extends BaseController {
  constructor(
    @inject(Di.DateService)
    private _dateService: IDateService
  ) {
    super();
  }

  static readonly ALL_VERSIONS = [v1];

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  async v1(request: PinControllerTypes.v1.Request, response: Response) {
    const {
      originalUrl,
      params: { id },
    } = request;

    const repository: IBaseRepository<PinControllerTypes.v1.EntityFields> | null =
      getRepositoryByOriginalUrl(originalUrl, 3);

    if (!repository) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const result = await repository.primitiveUpdate(
      { id, pinnedAt: IsNull() },
      { pinnedAt: this._dateService.now().toISOString() }
    );

    if (!result.affected) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    return this.finalizeRequest(response, HTTP.OK);
  }
}
