import { inject, injectable } from "tsyringe";
import { BucketMapper } from "@mappers/BucketMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { GetAllControllerTypes } from "types/controllers/Bucket/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllController extends BaseController {
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
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      query: { variantId },
    } = request;

    const [result] = await this._bucketRepository.getAll({
      select: {
        blueprint: {
          id: true,
        },
      },
      where: {
        variant: {
          id: variantId,
        },
      },
      relations: {
        blueprint: true,
      },
    });

    const mappedResult = this.mapper.map(result, BucketMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedResult);
  }
}
