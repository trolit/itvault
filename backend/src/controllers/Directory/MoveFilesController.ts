import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileService } from "types/services/IFileService";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { MoveFilesControllerTypes } from "types/controllers/Directory/MoveFilesController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class MoveFilesController extends BaseController {
  constructor(
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

  async v1(request: MoveFilesControllerTypes.v1.Request, response: Response) {
    const {
      query: { workspaceId },
      body: { sourceDirectoryId, targetDirectoryId },
    } = request;

    const result = await this._fileService.moveFromDirToDir({
      workspaceId,
      from: { directoryId: sourceDirectoryId },
      to: { directoryId: targetDirectoryId },
    });

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
