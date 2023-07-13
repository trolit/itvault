import { Response } from "express";
import { injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { BaseController } from "./BaseController";

import { ControllerImplementation } from "miscellaneous-types";

import { getRepositoryByOriginalUrl } from "@helpers/getRepositoryByOriginalUrl";

interface IParams {
  id: number;
}

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

  async v1(request: CustomRequest<IParams>, response: Response) {
    const {
      originalUrl,
      params: { id },
    } = request;

    const repository = getRepositoryByOriginalUrl(originalUrl);

    if (!repository) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const entity = await repository.getById(id);

    if (!entity) {
      return response.status(HTTP.NO_CONTENT).send();
    }

    await repository.softDeleteById(id);

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
