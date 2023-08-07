import { inject, injectable } from "tsyringe";
import { BundleMapper } from "@mappers/BundleMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { StoreControllerTypes } from "types/controllers/Bundle/StoreController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { AddBundleDto } from "@shared/types/dtos/AddBundleDto";
import { BundleStatus } from "@shared/types/enums/BundleStatus";
import { BundleConsumerHandlerData } from "consumer-handlers-types";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

import { sendToQueue } from "@helpers/sendToQueue";
import { getUniqueValuesFromCollection } from "@helpers/getUniqueValuesFromCollection";

import { BaseController } from "@controllers/BaseController";

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
    request: StoreControllerTypes.v1.Request,
    response: StoreControllerTypes.v1.Response
  ) {
    const {
      userId,
      query: { workspaceId },
      body: { values, note, expiration },
    } = request;

    const variantIds = getUniqueValuesFromCollection<AddBundleDto, string>(
      values,
      "variantIds"
    );

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

    const result = this.mapper.mapOneToDto(bundle, BundleMapper);

    return this.finalizeRequest(response, HTTP.CREATED, result);
  }
}
