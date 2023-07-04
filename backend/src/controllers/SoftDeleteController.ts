import { Response } from "express";
import { injectable } from "tsyringe";
import capitalize from "lodash/capitalize";
import { StatusCodes as HTTP } from "http-status-codes";

import { APP } from "@config";

import { IController } from "@interfaces/IController";
import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

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

    const { ROUTES_PREFIX } = APP;

    // @NOTE e.g. /api/notes/v1/1
    const [resourceinPlural] = originalUrl
      .replace(`${ROUTES_PREFIX}/`, "")
      .split("/");

    const resourceInSingular = resourceinPlural.slice(0, -1);

    const repository = getInstanceOf<IBaseRepository<unknown>>(
      `I${capitalize(resourceInSingular)}Repository`
    );

    await repository.softDeleteById(id);

    return response.status(HTTP.NO_CONTENT).send();
  }
}
