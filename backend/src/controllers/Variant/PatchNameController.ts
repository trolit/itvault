import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { PatchNameControllerTypes } from "types/controllers/Variant/PatchNameController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class PatchNameController extends BaseController {
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

  async v1(request: PatchNameControllerTypes.v1.Request, response: Response) {
    const {
      params: { id },
      body: { name },
    } = request;

    await this._variantRepository.primitiveUpdate(
      {
        id,
      },
      { name }
    );

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
