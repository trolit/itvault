import path from "path";
import fs from "fs-extra";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { FILES } from "@config";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IVariantRepository } from "@interfaces/repository/IVariantRepository";

interface IParams {
  workspaceId: number;

  variantId: string;
}

@injectable()
export class GetContentController
  implements IController<IParams, undefined, undefined, string>
{
  constructor(
    @inject(Di.VariantRepository)
    private _variantRepository: IVariantRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams>,
    response: CustomResponse<string>
  ) {
    const {
      params: { workspaceId, variantId },
    } = request;

    const variant = await this._variantRepository.findById(variantId);

    if (!variant) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    const { filename } = variant;

    const file = await fs.readFile(
      path.join(
        FILES.STORAGE.LOCAL.BASE_PATH,
        `workspace-${workspaceId}`,
        filename
      )
    );

    return response.status(HTTP.OK).send(file.toString());
  }
}
