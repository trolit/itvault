import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { ControllerImplementation } from "miscellaneous-types";
import { IFileService } from "@interfaces/services/IFileService";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  workspaceId: number;
}

const version1 = 1;

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
      version: version1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [version1];

  async v1(request: CustomRequest<IParams>, response: CustomResponse<File[]>) {
    const {
      files,
      userId,
      params: { workspaceId },
    } = request;

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
