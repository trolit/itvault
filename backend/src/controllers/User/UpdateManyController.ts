import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Result } from "@utils/Result";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@utils/types";
import { IUserRepository } from "@interfaces/repository/IUserRepository";

interface IRequestBody {
  value: UpdateUserDto[];
}

@injectable()
export class UpdateManyController
  implements
    IController<undefined, IRequestBody, undefined, Result<UpdateUserDto[]>>
{
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository
  ) {}

  async invoke(
    request: CustomRequest<undefined, IRequestBody>,
    response: CustomResponse<Result<UpdateUserDto[]>>
  ) {
    const {
      body: { value },
    } = request;

    const result = await this._userRepository.updateMany(value);

    if (!result.success) {
      return response.status(HTTP.BAD_REQUEST).send(result);
    }

    // @TODO redis

    return response.status(HTTP.NO_CONTENT).send();
  }
}
