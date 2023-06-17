import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Variant } from "@entities/Variant";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IVariantService } from "@interfaces/service/IVariantService";

interface IParams {
  workspaceId: number;
}

export interface IBody {
  name: string;

  fileId: number;

  variantId: string | undefined;
}

@injectable()
export class StoreController
  implements IController<IParams, IBody, undefined, Variant>
{
  constructor(
    @inject(Di.VariantService)
    private _variantService: IVariantService
  ) {}

  async invoke(
    request: CustomRequest<IParams, IBody>,
    response: CustomResponse<Variant>
  ) {
    const {
      params: { workspaceId },
    } = request;

    const result = await this._variantService.upload(request, {
      destination: `workspace-${workspaceId}`,
    });

    if (!result) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    return response.status(HTTP.OK).send(result);
  }
}
