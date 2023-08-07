import { inject, injectable } from "tsyringe";
import { VariantMapDto } from "@mappers/VariantMapDto";
import { StatusCodes as HTTP } from "http-status-codes";
import { StoreControllerTypes } from "types/controllers/Variant/StoreController";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { IFileService } from "@interfaces/services/IFileService";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(
    request: StoreControllerTypes.v1.Request,
    response: StoreControllerTypes.v1.Response
  ) {
    const {
      body,
      files,
      userId,
      query: { workspaceId },
    } = request;

    const variant = await this._variantRepository.save(userId, body, files);

    if (!variant) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    if (files.length) {
      this._fileService.moveFilesFromTemporaryDir(workspaceId, files);
    }

    const mappedResult = this.mapper.mapOneToDto(variant, VariantMapDto);

    return this.finalizeRequest(response, HTTP.CREATED, mappedResult);
  }
}
