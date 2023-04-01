import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { CustomRequest } from "@utilities/types";
import { IController } from "@interfaces/IController";
import { IUserRepository } from "@interfaces/IUserRepository";

interface IQueryParams {
  id: number;
}

@injectable()
export class SoftDeleteController
  implements IController<undefined, IQueryParams, undefined>
{
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository
  ) {}

  async invoke(
    request: CustomRequest<undefined, IQueryParams>,
    response: Response
  ) {
    const {
      query: { id },
    } = request;

    console.log(id);

    return response.status(HTTP.NO_CONTENT).send();
  }
}
