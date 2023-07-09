import path from "path";
import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { FILES } from "@config/index";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  workspaceId: number;

  id: number;
}

const version1 = 1;

@injectable()
export class DownloadController extends BaseController {
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: version1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [version1];

  async v1(request: CustomRequest<IParams>, response: Response) {
    const {
      params: { id },
    } = request;

    const bundle = await this._bundleRepository.getById(id);

    if (!bundle) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    response.download(path.join(FILES.BASE_DOWNLOADS_PATH, bundle.filename));

    return this.finalizeRequest(response, HTTP.OK);
  }
}
