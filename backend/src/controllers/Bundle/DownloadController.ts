import path from "path";
import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { DownloadControllerTypes } from "types/controllers/Bundle/DownloadController";

import { FILES } from "@config/index";

import { Di } from "@enums/Di";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(request: DownloadControllerTypes.v1.Request, response: Response) {
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
