import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { IController } from "@interfaces/IController";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

interface IParams {
  workspaceId: number;
}

interface IQuery {
  blueprintId?: number;

  relativePath?: string;
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
      query: { relativePath, blueprintId },
    } = request;

    let result: File[] = [];

    if (relativePath) {
      result = await this._fileRepository.getAllByRelativePath(
        workspaceId,
        relativePath
      );
    }

    if (blueprintId) {
      result = await this._fileRepository.getAllByBlueprintId(
        workspaceId,
        blueprintId
      );
    }

    return response.status(HTTP.OK).send(result);
  }
}
