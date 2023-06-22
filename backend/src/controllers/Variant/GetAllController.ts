import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Variant } from "@entities/Variant";
import { PaginatedResult } from "types/Result";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

interface IParams {
  workspaceId: number;
}

interface IQuery {
  fileId: number;
}

@injectable()
export class GetAllController
  implements IController<IParams, undefined, IQuery, PaginatedResult<Variant>>
{
  constructor(
    @inject(Di.VariantRepository)
    private _variantRepository: IVariantRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams, undefined, IQuery>,
    response: CustomResponse<PaginatedResult<Variant>>
  ) {
    const {
      query: { fileId },
      params: { workspaceId },
    } = request;

    const [result, total] = await this._variantRepository.getAll({
      where: {
        file: {
          id: fileId,
          workspace: {
            id: workspaceId,
          },
        },
      },
    });

    return response.status(HTTP.OK).send({ result, total });
  }
}
