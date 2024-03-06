import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { DeleteControllerTypes } from "types/controllers/DeleteController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class SoftDeleteController extends BaseController {
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

  async v1(request: DeleteControllerTypes.v1.Request, response: Response) {
    const {
      userId,
      params: { id },
      query: { workspaceId },
    } = request;

    const entity = await this._variantRepository.getOne({
      where: {
        id,
        file: {
          workspace: {
            id: workspaceId,
          },
        },
      },
    });

    if (entity)
      [
        await this._variantRepository.softDeleteEntity(entity, {
          data: {
            userId,
            workspaceId,
          },
        }),
      ];

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
