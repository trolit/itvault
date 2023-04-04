import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IController } from "@interfaces/IController";
import { IUserRepository } from "@interfaces/IUserRepository";
import { CustomRequest, CustomResponse } from "@utilities/types";

interface IRequestBody {
  value: UpdateUserDto[];
}

@injectable()
export class UpdateManyController
  implements IController<undefined, IRequestBody, undefined, UpdateUserDto[]>
{
  // @TODO schema
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository
  ) {}

  async invoke(
    request: CustomRequest<undefined, IRequestBody>,
    response: CustomResponse<UpdateUserDto[]>
  ) {
    const { value } = request.body;

    const result = await this._userRepository.updateMany(value);

    if (result.fails.length) {
      return response.status(HTTP.BAD_REQUEST).send(result.fails);
    }

    // @TODO redis

    return response.status(HTTP.NO_CONTENT).send();
  }
}
