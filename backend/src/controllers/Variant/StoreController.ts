import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Variant } from "@entities/Variant";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IBaseFileService } from "@interfaces/service/IBaseFileService";
import { IVariantRepository } from "@interfaces/repository/IVariantRepository";

interface IParams {
  workspaceId: number;
}

export interface IBody {
  name: string;

  fileId: number;

  variantId?: string;
}

@injectable()
export class StoreController
  implements IController<IParams, IBody, undefined, Variant>
{
  constructor(
    @inject(Di.VariantRepository)
    private _variantRepository: IVariantRepository,
    @inject(Di.FileService)
    private _fileService: IBaseFileService
  ) {}

  async invoke(
    request: CustomRequest<IParams, IBody>,
    response: CustomResponse<Variant>
  ) {
    const {
      body,
      files,
      params: { workspaceId },
    } = request;

    const variant = await this._variantRepository.save(body, files);

    if (!variant) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    if (files.length) {
      this._fileService.moveFilesFromTemporaryDir(workspaceId, files);
    }

    return response.status(HTTP.CREATED).send(variant);
  }
}
