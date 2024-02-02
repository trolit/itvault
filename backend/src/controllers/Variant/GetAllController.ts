import { inject, injectable } from "tsyringe";
import { Variant } from "@db/entities/Variant";
import { VariantMapper } from "@mappers/VariantMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { GetAllControllerTypes } from "types/controllers/Variant/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1];

  async v1(
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      query: { fileId, workspaceId },
    } = request;

    const result = await this._variantRepository.getAll({
      order: {
        name: "DESC",
      },
      where: {
        file: {
          id: fileId,
          workspace: {
            id: workspaceId,
          },
        },
      },
    });

    const mappedResult = this.mapper.map<Variant>(result).to(VariantMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedResult);
  }
}
