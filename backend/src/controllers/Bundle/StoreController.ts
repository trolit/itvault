import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { BundleDto } from "@dtos/BundleDto";
import { BundleStatus } from "@enums/BundleStatus";
import { BundleExpire } from "@enums/BundleExpire";
import { ControllerImplementation } from "miscellaneous-types";
import { BundleConsumerHandlerData } from "consumer-handlers-types";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

import { sendToQueue } from "@helpers/sendToQueue";

import { BaseController } from "@controllers/BaseController";

export interface IBody {
  note?: string;

  expiration: BundleExpire;

  values: BundleDto[];
}

interface IQuery {
  workspaceId: number;
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
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
    request: CustomRequest<undefined, IBody, IQuery>,
    response: Response
  ) {
    const {
      userId,
      query: { workspaceId },
      body: { values, note, expiration },
    } = request;

    const bundle = await this._bundleRepository.primitiveSave({
      note,
      size: 0,
      createdBy: {
        id: userId,
      },
      expire: expiration,
      status: BundleStatus.Queried,
      blueprints: values.map(({ blueprintId }) => ({ id: blueprintId })),
    });

    if (!bundle) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    sendToQueue<BundleConsumerHandlerData>(Queue.GenerateBundle, {
      bundle,
      workspaceId,
      body: request.body,
    });

    return this.finalizeRequest(response, HTTP.CREATED);
  }
}
