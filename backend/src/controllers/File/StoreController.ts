import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "types/enums/Di";
import { File } from "@entities/File";
import { IController } from "types/interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IBaseFileService } from "types/interfaces/service/IBaseFileService";
import { IFileRepository } from "types/interfaces/repository/IFileRepository";

interface IParams {
  workspaceId: number;
}

@injectable()
export class StoreController
  implements IController<IParams, undefined, undefined, File[]>
{
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository,
    @inject(Di.FileService)
    private _fileService: IBaseFileService
  ) {}

  async invoke(
    request: CustomRequest<IParams>,
    response: CustomResponse<File[]>
  ) {
    const {
      files,
      params: { workspaceId },
    } = request;

    const savedFiles = await this._fileRepository.save(workspaceId, files);

    if (!savedFiles) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    this._fileService.moveFilesFromTemporaryDir(workspaceId, files);

    return response.status(HTTP.OK).send(savedFiles);
  }
}
