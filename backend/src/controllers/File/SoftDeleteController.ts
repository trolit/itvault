import { Response } from "express";
import isInteger from "lodash/isInteger";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { SoftDeleteControllerTypes } from "types/controllers/SoftDeleteController";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
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

    const parsedId = parseInt(id);

    if (!isInteger(parsedId)) {
      return this.finalizeRequest(response, HTTP.NO_CONTENT);
    }

    await this._fileService.softDeleteFileAndVariants(parsedId);

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
