import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { BundleStatus } from "@enums/BundleStatus";
import { ControllerImplementation } from "miscellaneous-types";
import { BundleConsumerHandlerData } from "consumer-handlers-types";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

import { sendToQueue } from "@helpers/sendToQueue";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  id: number;
}

interface IQuery {
  workspaceId: number;
}

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

  async v1(
    request: CustomRequest<IParams, undefined, IQuery>,
    response: Response
  ) {
    const {
      params: { id },
      query: { workspaceId },
    } = request;

    const bundle = await this._bundleRepository.getOne({
      select: {
        blueprints: {
          id: true,
        },
        variants: {
          id: true,
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
        blueprints: true,
        variants: true,
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

    const isQueued = sendToQueue<BundleConsumerHandlerData>(
      Queue.GenerateBundle,
      {
        workspaceId,
        bundle,
      }
    );

    if (!isQueued) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    return this.finalizeRequest(response, HTTP.OK);
  }
}
