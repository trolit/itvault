import { Response } from "express";
import { IsNull, Not } from "typeorm";
import { injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBaseRepository } from "types/repositories/IBaseRepository";
import { UnpinControllerTypes } from "types/controllers/UnpinController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { BaseController } from "./BaseController";

import { getRepositoryByOriginalUrl } from "@helpers/getRepositoryByOriginalUrl";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UnpinController extends BaseController {
  static readonly ALL_VERSIONS = [v1];

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  async v1(request: UnpinControllerTypes.v1.Request, response: Response) {
    const {
      originalUrl,
      params: { id },
    } = request;

    const repository: IBaseRepository<UnpinControllerTypes.v1.EntityFields> | null =
      getRepositoryByOriginalUrl(originalUrl, 3);

    if (!repository) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const result = await repository.primitiveUpdate(
      { id, pinnedAt: Not(IsNull()) },
      { pinnedAt: null }
    );

    if (!result.affected) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    return this.finalizeRequest(response, HTTP.OK);
  }
}
