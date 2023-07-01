import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { BundleDto } from "@dtos/BundleDto";
import { BundleStatus } from "@enums/BundleStatus";
import { BundleExpire } from "@enums/BundleExpire";
import { IController } from "@interfaces/IController";
import { BundleConsumerHandlerData } from "consumer-handlers-types";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

import { sendToQueue } from "@helpers/sendToQueue";

interface IParams {
  workspaceId: number;
}

export interface IBody {
  note?: string;

  expiration: BundleExpire;

  values: BundleDto[];
}

@injectable()
export class StoreController implements IController<IParams, IBody> {
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository
  ) {}

  async invoke(request: CustomRequest<IParams, IBody>, response: Response) {
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

    // @DEPRECATED
    // await this._bundleService.build(workspaceId, request.body, bundle);

    return response.status(HTTP.CREATED).send();
  }
}
