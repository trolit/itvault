import { inject, injectable } from "tsyringe";
import { BucketMapper } from "@mappers/BucketMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBucketRepository } from "types/repositories/IBucketRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetBucketControllerTypes } from "types/controllers/Variant/GetBucketController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetBucketController extends BaseController {
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
    request: GetBucketControllerTypes.v1.Request,
    response: GetBucketControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { workspaceId, blueprintId },
    } = request;

    const bucket = await this._bucketRepository.getOne({
      where: {
        blueprint: {
          id: blueprintId,
          workspace: {
            id: workspaceId,
          },
        },
        variant: {
          id,
        },
      },
    });

    if (!bucket) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    const mappedBucket = this.mapper.map(bucket).to(BucketMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedBucket);
  }
}
