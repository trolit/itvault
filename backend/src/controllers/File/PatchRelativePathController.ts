import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileRepository } from "types/repositories/IFileRepository";
import { IDirectoryRepository } from "types/repositories/IDirectoryRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { PatchRelativePathControllerTypes } from "types/controllers/File/PatchRelativePathController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class PatchRelativePathController extends BaseController {
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository,
    @inject(Di.DirectoryRepository)
    private _directoryRepository: IDirectoryRepository
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

  async v1(
    request: PatchRelativePathControllerTypes.v1.Request,
    response: Response
  ) {
    const {
      params: { id },
      body: { relativePath },
      query: { workspaceId },
    } = request;

    const file = await this._fileRepository.getOne({
      where: {
        id,
        workspace: {
          id: workspaceId,
        },
      },
    });

    if (!file) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    const directory = await this._directoryRepository.getOne({
      where: {
        relativePath,
      },
    });

    if (!directory) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    await this._fileRepository.primitiveSave({
      ...file,
      directory,
    });

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
