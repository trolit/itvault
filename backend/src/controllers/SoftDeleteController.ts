import { Response } from "express";
import { injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Resource } from "@enums/Resource";
import { IController } from "@interfaces/IController";
import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

interface Params {
  resource: Resource;

  id: number;
}

@injectable()
export class GetAllController implements IController<Params> {
  async invoke(request: CustomRequest<Params>, response: Response) {
    const {
      params: { resource, id },
    } = request;

    const repository = getInstanceOf<IBaseRepository<unknown>>(
      `I${resource}Repository`
    );

    await repository.softDeleteById(id);

    return response.status(HTTP.NO_CONTENT).send();
  }
}
