import { inject, injectable } from "tsyringe";
import { BucketMapper } from "@mappers/BucketMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBucketRepository } from "types/repositories/IBucketRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetAllBucketsByBlueprintIdControllerTypes } from "types/controllers/Variant/GetAllBucketsByBlueprintIdController";

import { Di } from "@enums/Di";
import { Bucket } from "@entities/Bucket";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllBucketsByBlueprintIdController extends BaseController {
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
    request: GetAllBucketsByBlueprintIdControllerTypes.v1.Request,
    response: GetAllBucketsByBlueprintIdControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { workspaceId, blueprintId },
    } = request;

    const [buckets] = await this._bucketRepository.getAll({
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

    const mappedBuckets = this.mapper.map<Bucket>(buckets).to(BucketMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedBuckets);
  }
}
