import path from "path";
import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { FILES } from "@config/index";

import { Di } from "@enums/Di";
import { IController } from "@interfaces/IController";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

interface IParams {
  workspaceId: number;
}

interface IQuery {
  bundleId: number;
}

@injectable()
export class DownloadController
  implements IController<IParams, undefined, IQuery>
{
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams, undefined, IQuery>,
    response: Response
  ) {
    const {
      query: { bundleId },
    } = request;

    const bundle = await this._bundleRepository.getById(bundleId);

    if (!bundle) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    response.download(path.join(FILES.BASE_DOWNLOADS_PATH, bundle.filename));

    return response.status(HTTP.OK).send();
  }
}
