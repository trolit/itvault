import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Bucket } from "@entities/Bucket";
import { IController } from "@interfaces/IController";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

interface IQuery {
  variantId: string;
}

@injectable()
export class GetAllController
  implements IController<undefined, undefined, IQuery, Bucket[]>
{
  constructor(
    @inject(Di.BucketRepository)
    private _bucketRepository: IBucketRepository
  ) {}

  async invoke(
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

    return response.status(HTTP.OK).send(result);
  }
}
