import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Bucket } from "@entities/Bucket";
import { BucketDto } from "@dtos/BucketDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

import { BaseController } from "@controllers/BaseController";

interface IBody {
  values: BucketDto[];

  variantId: string;
}

const version1 = 1;

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
      version: version1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [version1];

  async v1(
    request: CustomRequest<undefined, IBody>,
    response: CustomResponse<Bucket[]>
  ) {
    const {
      body: { values, variantId },
    } = request;

    const result = await this._bucketRepository.save(variantId, values);

    if (!result) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
