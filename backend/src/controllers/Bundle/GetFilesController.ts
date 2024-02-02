import { inject, injectable } from "tsyringe";
import { Variant } from "@db/entities/Variant";
import { StatusCodes as HTTP } from "http-status-codes";
import { BundleFileMapper } from "@mappers/BundleFileMapper";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { GetFilesControllerTypes } from "types/controllers/Bundle/GetFilesController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetFilesController extends BaseController {
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
    request: GetFilesControllerTypes.v1.Request,
    response: GetFilesControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { workspaceId, blueprintId },
    } = request;

    const variants = await this._variantRepository.getAll({
      where: {
        buckets: {
          blueprint: {
            id: blueprintId,
          },
        },
        file: {
          workspace: {
            id: workspaceId,
          },
        },
        variantToBundle: {
          bundle: {
            id,
          },
        },
      },
      relations: {
        file: true,
      },
    });

    const result = this.mapper.map<Variant>(variants).to(BundleFileMapper);

    return this.finalizeRequest(response, HTTP.OK, result);
  }
}
