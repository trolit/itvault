import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { VariantDto } from "@dtos/VariantDto";
import { IController } from "@interfaces/IController";
import { IVariantService } from "@interfaces/services/IVariantService";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

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

    return response.status(HTTP.OK).send({
      entry: variant,
      content,
    });
  }
}
