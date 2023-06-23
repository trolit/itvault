import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Palette } from "@entities/Bucket";
import { IController } from "@interfaces/IController";
import { StorePaletteDto } from "@dtos/StorePaletteDto";
import { IPaletteRepository } from "@interfaces/repositories/IPaletteRepository";

interface IParams {
  variantId: string;
}

interface IBody {
  values: StorePaletteDto[];
}

@injectable()
export class StoreController
  implements IController<IParams, IBody, undefined, Palette[]>
{
  constructor(
    @inject(Di.PaletteRepository)
    private _paletteRepository: IPaletteRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams, IBody>,
    response: CustomResponse<Palette[]>
  ) {
    const {
      params: { variantId },
      body: { values },
    } = request;

    const result = await this._paletteRepository.save(variantId, values);

    if (!result) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return response.status(HTTP.NO_CONTENT).send();
  }
}
