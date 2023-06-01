import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IFileRepository } from "@interfaces/repository/IFileRepository";

interface IParams {
  workspaceId: number;
}

@injectable()
export class GetAllRootController
  implements IController<IParams, undefined, undefined, File[]>
{
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams>,
    response: CustomResponse<File[]>
  ) {
    const {
      params: { workspaceId },
    } = request;

    const result =
      await this._fileRepository.getAllWorkspaceFilesByRelativePath(
        workspaceId,
        "."
      );

    return response.status(HTTP.OK).send(result);
  }
}
