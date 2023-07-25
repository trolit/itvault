import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { GetAllControllerTypes } from "types/controllers/Variant/GetAllController";

import { Di } from "@enums/Di";
import { VariantMapDto } from "@dtos/VariantMapDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

import { BaseController } from "@controllers/BaseController";

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
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
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

    const mappedResult = this.mapper.mapToDto(result, VariantMapDto);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
