import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Blueprint } from "@entities/Blueprint";
import { BlueprintDto } from "@dtos/BlueprintDto";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

interface IParams {
  workspaceId: number;
}

@injectable()
export class StoreController
  implements IController<IParams, BlueprintDto, undefined, Blueprint>
{
  constructor(
    @inject(Di.BlueprintRepository)
    private _blueprintRepository: IBlueprintRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams, BlueprintDto>,
    response: CustomResponse<Blueprint>
  ) {
    const {
      body,
      params: { workspaceId },
    } = request;

    const blueprint = await this._blueprintRepository.save(workspaceId, body);

    if (!blueprint) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return response.status(HTTP.CREATED).send(blueprint);
  }
}
