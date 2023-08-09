import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileRepository } from "types/repositories/IFileRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { PatchRelativePathControllerTypes } from "types/controllers/File/PatchRelativePathController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class PatchRelativePathController extends BaseController {
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository
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

  async v1(
    request: PatchRelativePathControllerTypes.v1.Request,
    response: Response
  ) {
    const {
      params: { id },
      body: { relativePath },
    } = request;

    await this._fileRepository.primitiveUpdate(
      {
        id,
      },
      { relativePath }
    );

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
