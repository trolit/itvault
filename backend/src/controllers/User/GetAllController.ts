import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { PaginatedResult } from "@utils/Result";
import { IController } from "@interfaces/IController";
import { IUserRepository } from "@interfaces/repository/IUserRepository";
import { CustomRequest, CustomResponse } from "@utils/types";
import { IEntityMapperService } from "@interfaces/service/IEntityMapperService";

interface IQuery {
  skip: number;

  take: number;
}

@injectable()
export class GetAllController
  implements
    IController<undefined, undefined, IQuery, PaginatedResult<UserDto>>
{
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
    @inject(Di.EntityMapperService)
    private _entityMapperService: IEntityMapperService
  ) {}

  async invoke(
    request: CustomRequest<undefined, undefined, IQuery>,
    response: CustomResponse<PaginatedResult<UserDto>>
  ) {
    const {
      query: { skip, take },
    } = request;

    const [result, total] = await this._userRepository.getAll({
      pagination: { take, skip },
    });

    const mappedResult = this._entityMapperService.mapToDto(
      result,
      UserDto,
      ({ role: { id, name }, deletedAt }) => ({
        roleId: id,
        roleName: name,
        isActive: deletedAt === null,
      })
    );

    return response.status(HTTP.OK).send({ result: mappedResult, total });
  }
}
