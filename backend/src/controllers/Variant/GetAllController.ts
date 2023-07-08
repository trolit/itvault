import { inject, injectable } from "tsyringe";
import { PaginatedResult } from "types/Result";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Variant } from "@entities/Variant";
import { ControllerImplementation } from "miscellaneous-types";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  workspaceId: number;
}

interface IQuery {
  fileId: number;
}

const version1 = 1;

@injectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.VariantRepository)
    private _variantRepository: IVariantRepository
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

    return this.finalizeRequest(response, HTTP.OK, { result, total });
  }
}
