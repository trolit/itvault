import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileService } from "types/services/IFileService";
import { IBundleRepository } from "types/repositories/IBundleRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { DownloadControllerTypes } from "types/controllers/Bundle/DownloadController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class DownloadController extends BaseController {
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository,
    @inject(Di.FileService)
    private _fileService: IFileService
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static readonly ALL_VERSIONS = [v1];

  async v1(request: DownloadControllerTypes.v1.Request, response: Response) {
    const {
      params: { id },
    } = request;

    const bundle = await this._bundleRepository.getById(id);

    if (!bundle) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    await this._fileService.downloadBundle({
      bundle,
      response,
    });
  }
}
