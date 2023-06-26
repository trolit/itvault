import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Bucket } from "@entities/Bucket";
import { BucketDto } from "@dtos/BucketDto";
import { IController } from "@interfaces/IController";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

interface IBody {
  values: BucketDto[];

  variantId: string;
}

@injectable()
export class StoreController
  implements IController<undefined, IBody, undefined, Bucket[]>
{
  constructor(
    @inject(Di.BucketRepository)
    private _bucketRepository: IBucketRepository
  ) {}

  async invoke(
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

    return response.status(HTTP.NO_CONTENT).send();
  }
}
