import { inject, injectable } from "tsyringe";
import { PaginatedResult } from "types/Result";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Variant } from "@entities/Variant";
import { ControllerImplementation } from "miscellaneous-types";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

import { BaseController } from "@controllers/BaseController";

interface IQuery {
  fileId: number;

  workspaceId: number;
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(
    request: CustomRequest<undefined, undefined, IQuery>,
    response: CustomResponse<PaginatedResult<Variant>>
  ) {
    const {
      query: { fileId, workspaceId },
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
