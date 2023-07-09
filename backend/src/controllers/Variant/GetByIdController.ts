import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { VariantDto } from "@dtos/VariantDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IVariantService } from "@interfaces/services/IVariantService";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  workspaceId: number;

  variantId: string;
}

const version1 = 1;

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
      version: version1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [version1];

  async v1(
    request: CustomRequest<IParams>,
    response: CustomResponse<VariantDto>
  ) {
    const {
      params: { workspaceId, variantId },
    } = request;

    const variant = await this._variantRepository.getById(variantId);

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

    return this.finalizeRequest(response, HTTP.OK, { entry: variant, content });
  }
}
