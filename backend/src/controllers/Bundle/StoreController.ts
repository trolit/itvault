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

interface IParams {
  workspaceId: number;
}

export interface IBody {
  note?: string;

  expiration: BundleExpire;

  values: BundleDto[];
}

const version1 = 1;

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
      version: version1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [version1];

  async v1(request: CustomRequest<IParams, IBody>, response: Response) {
    const {
      userId,
      params: { workspaceId },
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
