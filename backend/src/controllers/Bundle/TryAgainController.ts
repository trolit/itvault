import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

import { BaseController } from "@controllers/BaseController";

interface IBody {
  id: number;
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class TryAgainController extends BaseController {
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository
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

  async v1(request: CustomRequest<undefined, IBody>, response: Response) {
    const {
      body: { id },
    } = request;

    const bundle = await this._bundleRepository.getById(id);

    if (!bundle) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    // @TODO queue bundle generation

    return this.finalizeRequest(response, HTTP.OK);
  }
}
