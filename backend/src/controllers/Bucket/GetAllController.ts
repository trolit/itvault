import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Bucket } from "@entities/Bucket";
import { IController } from "@interfaces/IController";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

interface IParams {
  variantId: string;
}

@injectable()
export class GetAllController
  implements IController<IParams, undefined, undefined, Bucket[]>
{
  constructor(
    @inject(Di.BucketRepository)
    private _bucketRepository: IBucketRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams>,
    response: CustomResponse<Bucket[]>
  ) {
    const {
      params: { variantId },
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

    return response.status(HTTP.OK).send(result);
  }
}
