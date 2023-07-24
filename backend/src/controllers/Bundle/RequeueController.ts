import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { RequeueControllerTypes } from "types/controllers/Bundle/RequeueController";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { BundleStatus } from "@enums/BundleStatus";
import { ControllerImplementation } from "miscellaneous-types";
import { BundleConsumerHandlerData } from "consumer-handlers-types";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

import { sendToQueue } from "@helpers/sendToQueue";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class RequeueController extends BaseController {
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

  async v1(request: RequeueControllerTypes.v1.Request, response: Response) {
    const {
      params: { id },
      query: { workspaceId },
    } = request;

    const bundle = await this._bundleRepository.getOne({
      select: {
        blueprintToBundle: {
          blueprint: {
            id: true,
          },
        },
        variantToBundle: {
          variant: {
            id: true,
          },
        },
      },
      where: {
        id,
        workspace: {
          id: workspaceId,
        },
        status: BundleStatus.Failed,
      },
      relations: {
        blueprintToBundle: {
          blueprint: true,
        },
        variantToBundle: {
          variant: true,
        },
      },
    });

    if (!bundle) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    await this._bundleRepository.primitiveUpdate(
      {
        id,
      },
      {
        status: BundleStatus.Queried,
      }
    );

    sendToQueue<BundleConsumerHandlerData>(Queue.GenerateBundle, {
      workspaceId,
      bundle,
    });

    return this.finalizeRequest(response, HTTP.OK);
  }
}
