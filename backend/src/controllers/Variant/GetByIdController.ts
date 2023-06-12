import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { VariantDto } from "@dtos/VariantDto";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IVariantService } from "@interfaces/service/IVariantService";
import { IVariantRepository } from "@interfaces/repository/IVariantRepository";

interface IParams {
  workspaceId: number;

  variantId: string;
}

@injectable()
export class GetByIdController
  implements IController<IParams, undefined, undefined, VariantDto>
{
  constructor(
    @inject(Di.VariantRepository)
    private _variantRepository: IVariantRepository,
    @inject(Di.VariantService)
    private _variantService: IVariantService
  ) {}

  async invoke(
    request: CustomRequest<IParams>,
    response: CustomResponse<VariantDto>
  ) {
    const {
      params: { workspaceId, variantId },
    } = request;

    const variant = await this._variantRepository.findById(variantId);

    if (!variant) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    const content = await this._variantService.getContent(
      variant,
      `workspace-${workspaceId}`
    );

    return response.status(HTTP.OK).send({
      entry: variant,
      content,
    });
  }
}
