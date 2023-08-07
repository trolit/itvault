import assert from "assert";
import { inject, injectable } from "tsyringe";
import { BucketMapDto } from "@mappers/BucketMapDto";
import { StatusCodes as HTTP } from "http-status-codes";
import { StoreManyControllerTypes } from "types/controllers/Bucket/StoreManyController";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreManyController extends BaseController {
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
    request: StoreManyControllerTypes.v1.Request,
    response: StoreManyControllerTypes.v1.Response
  ) {
    const {
      body: { values, variantId },
    } = request;

    const result = await this._bucketRepository.save(variantId, values);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    assert(result.value);

    const mappedResult = this.mapper.mapToDto(result.value, BucketMapDto);

    return this.finalizeRequest(response, HTTP.CREATED, mappedResult);
  }
}
