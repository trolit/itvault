import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { PaginatedResult } from "@utils/Result";
import { Blueprint } from "@entities/Blueprint";
import { IController } from "@interfaces/IController";
import { IFileService } from "@interfaces/service/IFileService";
import { CustomRequest, CustomResponse } from "@custom-types/express";

interface IParams {
  id: number;
}

@injectable()
export class StoreController
  implements
    IController<IParams, undefined, undefined, PaginatedResult<Blueprint>>
{
  constructor(
    @inject(Di.FileService)
    private _fileService: IFileService
  ) {}

  // @TODO return structure of uploaded files
  async invoke(
    request: CustomRequest<IParams>,
    response: CustomResponse<PaginatedResult<Blueprint>>
  ) {
    const {
      params: { id },
    } = request;

    try {
      await this._fileService.upload(request, `/workspace-${id}`);
    } catch (error) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    return response.status(HTTP.NO_CONTENT).send();
  }
}
