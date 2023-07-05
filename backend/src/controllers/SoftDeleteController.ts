import { Response } from "express";
import { injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { IController } from "@interfaces/IController";

import { getRepositoryByOriginalUrl } from "@helpers/getRepositoryByOriginalUrl";

interface IParams {
  id: number;
}

@injectable()
export class SoftDeleteController implements IController<IParams> {
  async invoke(request: CustomRequest<IParams>, response: Response) {
    const {
      originalUrl,
      params: { id },
    } = request;

    const repository = getRepositoryByOriginalUrl(originalUrl);

    if (!repository) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    await repository.softDeleteById(id);

    return response.status(HTTP.NO_CONTENT).send();
  }
}
