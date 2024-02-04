import assert from "assert";
import { inject, injectable } from "tsyringe";
import { BucketMapper } from "@mappers/BucketMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBucketRepository } from "types/repositories/IBucketRepository";
import { UpsertControllerTypes } from "types/controllers/Bucket/UpsertController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpsertController extends BaseController {
  constructor(
    @inject(Di.BucketRepository)
    private _bucketRepository: IBucketRepository
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
    request: UpsertControllerTypes.v1.Request,
    response: UpsertControllerTypes.v1.Response
  ) {
    const {
      userId,
      body: { blueprintId, variantId, value },
    } = request;

    const result = await this._bucketRepository.save({
      value,
      userId,
      variantId,
      blueprintId,
    });

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    assert(result.value);

    const { bucket, isUpdate } = result.value;

    const mappedResult = this.mapper.map(bucket).to(BucketMapper);

    return this.finalizeRequest(
      response,
      isUpdate ? HTTP.OK : HTTP.CREATED,
      mappedResult
    );
  }
}
