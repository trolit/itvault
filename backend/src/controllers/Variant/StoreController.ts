import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Variant } from "@entities/Variant";
import { ControllerImplementation } from "miscellaneous-types";
import { IFileService } from "@interfaces/services/IFileService";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  workspaceId: number;
}

const version1 = 1;

export interface IBody {
  name: string;

  fileId: number;

  variantId?: string;
}

@injectable()
export class StoreController extends BaseController {
  constructor(
    @inject(Di.VariantRepository)
    private _variantRepository: IVariantRepository,
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

  async v1(
    request: CustomRequest<IParams, IBody>,
    response: CustomResponse<Variant>
  ) {
    const {
      body,
      files,
      userId,
      params: { workspaceId },
    } = request;

    const variant = await this._variantRepository.save(userId, body, files);

    if (!variant) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    if (files.length) {
      this._fileService.moveFilesFromTemporaryDir(workspaceId, files);
    }

    return this.finalizeRequest(response, HTTP.CREATED, variant);
  }
}
