import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { ControllerImplementation } from "miscellaneous-types";
import { IFileService } from "@interfaces/services/IFileService";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { BaseController } from "@controllers/BaseController";

interface IQuery {
  workspaceId: number;
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository,
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

  async v1(
    request: CustomRequest<undefined, undefined, IQuery>,
    response: CustomResponse<File[]>
  ) {
    const {
      files,
      userId,
      query: { workspaceId },
    } = request;

    // @TODO chunk!!
    const savedFiles = await this._fileRepository.save(
      userId,
      workspaceId,
      files
    );

    if (!savedFiles) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    this._fileService.moveFilesFromTemporaryDir(workspaceId, files);

    return this.finalizeRequest(response, HTTP.OK, savedFiles);
  }
}
