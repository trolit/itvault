import { inject, injectable } from "tsyringe";
import { VariantMapper } from "@mappers/VariantMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IVariantService } from "types/services/IVariantService";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { GetByIdControllerTypes } from "types/controllers/Variant/GetByIdController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetByIdController extends BaseController {
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
    request: GetByIdControllerTypes.v1.Request,
    response: GetByIdControllerTypes.v1.Response
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

    // @TODO change to "GetContentByIdController"
    return this.finalizeRequest(response, HTTP.OK, {
      record: this.mapper.map(variant).to(VariantMapper),
      content,
    });
  }
}
