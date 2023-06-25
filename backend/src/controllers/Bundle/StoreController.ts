import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { BundleDto } from "@dtos/BundleDto";
import { BundleStatus } from "@enums/BundleStatus";
import { BundleExpire } from "@enums/BundleExpire";
import { IController } from "@interfaces/IController";
import { IBundleService } from "@interfaces/services/IBundleService";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

interface IParams {
  workspaceId: number;
}

export interface IBody {
  note: string | undefined;

  expiration: BundleExpire;

  values: BundleDto[];
}

@injectable()
export class StoreController implements IController<IParams, IBody> {
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository,
    @inject(Di.BundleService)
    private _bundleService: IBundleService
  ) {}

  async invoke(request: CustomRequest<IParams, IBody>, response: Response) {
    const {
      userId,
      params: { workspaceId },
      body: { values, note, expiration },
    } = request;

    const bundle = await this._bundleRepository.primitiveSave({
      note,
      size: 0,
      createdBy: {
        id: userId,
      },
      expire: expiration,
      status: BundleStatus.Queried,
      blueprints: values.map(({ blueprintId }) => ({ id: blueprintId })),
    });

    if (!bundle) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    await this._bundleService.build(workspaceId, request.body, bundle);

    return response.status(HTTP.CREATED).send();
  }
}
