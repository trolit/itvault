import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBundleRepository } from "types/repositories/IBundleRepository";
import { RequeueControllerTypes } from "types/controllers/Bundle/RequeueController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { BundleConsumerHandlerData } from "types/consumer-handlers/BundleConsumerHandlerData";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { BundleStatus } from "@shared/types/enums/BundleStatus";

import { sendToQueue } from "@helpers/sendToQueue";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static readonly ALL_VERSIONS = [v1];

  async v1(request: RequeueControllerTypes.v1.Request, response: Response) {
    const {
      params: { id },
      query: { workspaceId },
    } = request;

    const bundle = await this._bundleRepository.getOne({
      select: {
        blueprintToBundle: {
          id: true,
          blueprint: {
            id: true,
          },
        },
        variantToBundle: {
          id: true,
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
        status: BundleStatus.Enqueued,
      }
    );

    sendToQueue<BundleConsumerHandlerData>(Queue.GenerateBundle, {
      workspaceId,
      bundle,
    });

    return this.finalizeRequest(response, HTTP.OK);
  }
}
