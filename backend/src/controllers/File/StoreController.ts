import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IBaseFileService } from "@interfaces/service/IBaseFileService";
import { IFileRepository } from "@interfaces/repository/IFileRepository";

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

    const result = await this._fileRepository.save(workspaceId, files);

    if (!result) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    await this._fileService.moveFilesFromTemporaryDir(workspaceId, files);

    return response.status(HTTP.OK).send(result);
  }
}
