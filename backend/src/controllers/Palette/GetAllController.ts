import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Palette } from "@entities/Palette";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IPaletteRepository } from "@interfaces/repository/IPaletteRepository";

interface IParams {
  workspaceId: number;
}

interface IQuery {
  variantId: number;
}

@injectable()
export class GetAllController
  implements IController<IParams, undefined, IQuery, Palette[]>
{
  constructor(
    @inject(Di.PaletteRepository)
    private _paletteRepository: IPaletteRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams, undefined, IQuery>,
    response: CustomResponse<Palette[]>
  ) {
    const {
      query: { variantId },
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
