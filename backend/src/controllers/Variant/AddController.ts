import { inject, injectable } from "tsyringe";
import { VariantMapper } from "@mappers/VariantMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileService } from "types/services/IFileService";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { AddControllerTypes } from "types/controllers/Variant/AddController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class AddController extends BaseController {
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
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1];

  async v1(
    request: AddControllerTypes.v1.Request,
    response: AddControllerTypes.v1.Response
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
      this._fileService.moveWorkspaceFilesFromTemporaryDir({
        files,
        workspaceId,
      });
    }

    const mappedResult = this.mapper.map(variant).to(VariantMapper);

    return this.finalizeRequest(response, HTTP.CREATED, mappedResult);
  }
}
