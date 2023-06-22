import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "types/enums/Di";
import { File } from "@entities/File";
import { IController } from "types/interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IFileRepository } from "types/interfaces/repository/IFileRepository";

interface IParams {
  workspaceId: number;
}

interface IQuery {
  relativePath: string;
}

@injectable()
export class GetAllController
  implements IController<IParams, undefined, IQuery, File[]>
{
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams, undefined, IQuery>,
    response: CustomResponse<File[]>
  ) {
    const {
      params: { workspaceId },
      query: { relativePath },
    } = request;

    const result = await this._fileRepository.getAllByRelativePath(
      workspaceId,
      relativePath
    );

    return response.status(HTTP.OK).send(result);
  }
}
