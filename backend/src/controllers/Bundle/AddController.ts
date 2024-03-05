import { inject, injectable } from "tsyringe";
import { BundleMapper } from "@mappers/BundleMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBundleRepository } from "types/repositories/IBundleRepository";
import { AddControllerTypes } from "types/controllers/Bundle/AddController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { BundleConsumerHandlerData } from "types/consumer-handlers/BundleConsumerHandlerData";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { IAddBundleValueDTO } from "@shared/types/DTOs/Bundle";
import { BundleStatus } from "@shared/types/enums/BundleStatus";

import { sendToQueue } from "@helpers/sendToQueue";
import { getUniqueValuesFromCollection } from "@helpers/getUniqueValuesFromCollection";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class AddController extends BaseController {
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

  static ALL_VERSIONS = [v1];

  async v1(
    request: AddControllerTypes.v1.Request,
    response: AddControllerTypes.v1.Response
  ) {
    const {
      userId,
      query: { workspaceId },
      body: { values, note, expiration },
    } = request;

    const variantIds = getUniqueValuesFromCollection<
      IAddBundleValueDTO,
      string
    >(values, "variantIds");

    const bundle = await this._bundleRepository.primitiveSave(
      {
        note,
        size: 0,
        createdBy: {
          id: userId,
        },
        workspace: {
          id: workspaceId,
        },
        expiresAt: null,
        expire: expiration,
        status: BundleStatus.Enqueued,
        variantToBundle: variantIds.map(variantId => ({
          variant: { id: variantId },
        })),
        blueprintToBundle: values.map(({ blueprintId }) => ({
          blueprint: { id: blueprintId },
        })),
      },
      {
        data: {
          userId,
        },
      }
    );

    if (!bundle) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    sendToQueue<BundleConsumerHandlerData>(Queue.GenerateBundle, {
      workspaceId,
      bundle,
    });

    const result = this.mapper.map(bundle).to(BundleMapper);

    return this.finalizeRequest(response, HTTP.CREATED, result);
  }
}
