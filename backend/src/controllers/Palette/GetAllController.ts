import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Palette } from "@entities/Palette";
import { IController } from "@interfaces/IController";
import { IPaletteRepository } from "@interfaces/repositories/IPaletteRepository";

interface IParams {
  variantId: string;
}

@injectable()
export class GetAllController
  implements IController<IParams, undefined, undefined, Palette[]>
{
  constructor(
    @inject(Di.PaletteRepository)
    private _paletteRepository: IPaletteRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams>,
    response: CustomResponse<Palette[]>
  ) {
    const {
      params: { variantId },
    } = request;

    const [result] = await this._paletteRepository.getAll({
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
