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

  id: number;
}

@injectable()
export class DownloadController implements IController<IParams> {
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository
  ) {}

  async invoke(request: CustomRequest<IParams>, response: Response) {
    const {
      params: { id },
    } = request;

    const bundle = await this._bundleRepository.getById(id);

    if (!bundle) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    response.download(path.join(FILES.BASE_DOWNLOADS_PATH, bundle.filename));

    return response.status(HTTP.OK).send();
  }
}
