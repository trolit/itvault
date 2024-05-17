import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileService } from "types/services/IFileService";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetContentByIdControllerTypes } from "types/controllers/Variant/GetContentByIdController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetContentByIdController extends BaseController {
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

  static readonly ALL_VERSIONS = [v1];

  async v1(
    request: GetContentByIdControllerTypes.v1.Request,
    response: GetContentByIdControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { workspaceId },
    } = request;

    const variant = await this._variantRepository.getById(id);

    if (!variant) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    const content = await this._fileService.getContent({
      variant,
      from: { workspaceId },
    });

    if (!content) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    return this.finalizeRequest(response, HTTP.OK, content);
  }
}
