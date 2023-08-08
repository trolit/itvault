import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { SoftDeleteControllerTypes } from "types/controllers/File/SoftDeleteController";

import { Di } from "@enums/Di";
import { IFileService } from "@interfaces/services/IFileService";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class SoftDeleteController extends BaseController {
  constructor(
    @inject(Di.FileService)
    private _fileService: IFileService
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

  async v1(request: SoftDeleteControllerTypes.v1.Request, response: Response) {
    const {
      params: { id },
    } = request;

    await this._fileService.softDeleteFileAndVariants(id);

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
