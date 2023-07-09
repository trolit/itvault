import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Bucket } from "@entities/Bucket";
import { ControllerImplementation } from "miscellaneous-types";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

import { BaseController } from "@controllers/BaseController";

interface IQuery {
  variantId: string;
}

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
    request: CustomRequest<undefined, undefined, IQuery>,
    response: CustomResponse<Bucket[]>
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

    return this.finalizeRequest(response, HTTP.OK, result);
  }
}
