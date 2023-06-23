import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Bucket } from "@entities/Bucket";
import { BucketDto } from "@dtos/BucketDto";
import { IController } from "@interfaces/IController";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

interface IParams {
  variantId: string;
}

interface IBody {
  values: BucketDto[];
}

@injectable()
export class StoreController
  implements IController<IParams, IBody, undefined, Bucket[]>
{
  constructor(
    @inject(Di.BucketRepository)
    private _bucketRepository: IBucketRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams, IBody>,
    response: CustomResponse<Bucket[]>
  ) {
    const {
      params: { variantId },
      body: { values },
    } = request;

    const result = await this._bucketRepository.save(variantId, values);

    if (!result) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return response.status(HTTP.NO_CONTENT).send();
  }
}
