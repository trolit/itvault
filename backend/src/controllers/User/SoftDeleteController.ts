import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { CustomRequest } from "@utilities/types";
import { IController } from "@interfaces/IController";
import { IUserRepository } from "@interfaces/IUserRepository";

interface IParams {
  id: number;
}

@injectable()
export class SoftDeleteController implements IController<IParams> {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository
  ) {}

  async invoke(request: CustomRequest<IParams>, response: Response) {
    const { id } = request.params;

    const result = await this._userRepository.softDeleteById(id);

    if (!result || !result.affected) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    return response.status(HTTP.NO_CONTENT).send();
  }
}
