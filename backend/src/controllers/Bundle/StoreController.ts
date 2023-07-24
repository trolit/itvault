import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { StoreControllerTypes } from "types/controllers/Bundle/StoreController";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { BundleStatus } from "@enums/BundleStatus";
import { ControllerImplementation } from "miscellaneous-types";
import { BundleConsumerHandlerData } from "consumer-handlers-types";
import { IBundleService } from "@interfaces/services/IBundleService";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

import { sendToQueue } from "@helpers/sendToQueue";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository,
    @inject(Di.BundleService)
    private _bundleService: IBundleService
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

  async v1(request: StoreControllerTypes.v1.Request, response: Response) {
    const {
      userId,
      query: { workspaceId },
      body: { values, note, expiration },
    } = request;

    const variantIds = this._bundleService.getUniqueVariantIds(values);

    const bundle = await this._bundleRepository.primitiveSave({
      note,
      size: 0,
      createdBy: {
        id: userId,
      },
      workspace: {
        id: workspaceId,
      },
      expire: expiration,
      status: BundleStatus.Queried,
      variantToBundle: variantIds.map(variantId => ({
        variant: { id: variantId },
      })),
      blueprintToBundle: values.map(({ blueprintId }) => ({
        blueprint: { id: blueprintId },
      })),
    });

    if (!bundle) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    sendToQueue<BundleConsumerHandlerData>(Queue.GenerateBundle, {
      workspaceId,
      bundle,
    });

    return this.finalizeRequest(response, HTTP.CREATED, bundle);
  }
}
