import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IVariantService } from "types/services/IVariantService";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetContentByIdControllerTypes } from "types/controllers/Variant/GetContentByIdController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetContentByIdController extends BaseController {
  constructor(
    @inject(Di.VariantRepository)
    private _variantRepository: IVariantRepository,
    @inject(Di.VariantService)
    private _variantService: IVariantService
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

    const content = await this._variantService.getContent(
      variant,
      `workspace-${workspaceId}`
    );

    if (!content) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    return this.finalizeRequest(response, HTTP.OK, content);
  }
}
