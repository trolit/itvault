import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { IController } from "@interfaces/IController";
import { IFileService } from "@interfaces/service/IFileService";
import { CustomRequest, CustomResponse } from "@custom-types/express";

interface IParams {
  workspaceId: number;
}

@injectable()
export class StoreController
  implements IController<IParams, undefined, undefined, File[]>
{
  constructor(
    @inject(Di.FileService)
    private _fileService: IFileService
  ) {}

  async invoke(
    request: CustomRequest<IParams>,
    response: CustomResponse<File[]>
  ) {
    const {
      params: { workspaceId },
    } = request;

    const result = await this._fileService.upload(
      workspaceId,
      request,
      `workspace-${workspaceId}`
    );

    if (!result) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    return response.status(HTTP.OK).send(result);
  }
}
