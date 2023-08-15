import assert from "assert";
import { inject, injectable } from "tsyringe";
import { BucketMapper } from "@mappers/BucketMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBucketRepository } from "types/repositories/IBucketRepository";
import { StoreControllerTypes } from "types/controllers/Bucket/StoreController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
  constructor(
    @inject(Di.BucketRepository)
    private _bucketRepository: IBucketRepository
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
      body: { blueprintId, variantId, value },
    } = request;

    const result = await this._bucketRepository.save(
      value,
      blueprintId,
      variantId
    );

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    assert(result.value);

    const mappedResult = this.mapper.map(result.value).to(BucketMapper);

    return this.finalizeRequest(response, HTTP.CREATED, mappedResult);
  }
}
