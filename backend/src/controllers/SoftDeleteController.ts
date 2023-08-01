import { Response } from "express";
import { injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { SoftDeleteControllerTypes } from "types/controllers/SoftDeleteController";

import { BaseController } from "./BaseController";

import { ControllerImplementation } from "miscellaneous-types";

import { getRepositoryByOriginalUrl } from "@helpers/getRepositoryByOriginalUrl";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class SoftDeleteController extends BaseController {
  implementations: ControllerImplementation[] = [
    {
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(request: SoftDeleteControllerTypes.v1.Request, response: Response) {
    const {
      originalUrl,
      params: { id },
    } = request;

    const repository = getRepositoryByOriginalUrl(originalUrl);

    if (!repository) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    await repository.softDelete({ id });

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
