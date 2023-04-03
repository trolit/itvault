import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IController } from "@interfaces/IController";
import { IUserRepository } from "@interfaces/IUserRepository";
import { CustomRequest, CustomResponse } from "@utilities/types";

@injectable()
export class UpdateManyController
  implements
    IController<undefined, UpdateUserDto[], undefined, UpdateUserDto[]>
{
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository
  ) {}

  async invoke(
    request: CustomRequest<undefined, UpdateUserDto[]>,
    response: CustomResponse<UpdateUserDto[]>
  ) {
    const result = await this._userRepository.updateMany(request.body);

    if (!result.fails.length) {
      return response.status(HTTP.BAD_REQUEST).send(result.fails);
    }

    // @TODO redis

    return response.status(HTTP.NO_CONTENT).send();
  }
}
