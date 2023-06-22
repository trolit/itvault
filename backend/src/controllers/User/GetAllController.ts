import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { PaginatedResult } from "@utils/Result";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";
import { IEntityMapperService } from "@interfaces/services/IEntityMapperService";

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
      skip,
      take,
      order: {
        email: "asc",
      },
      relations: {
        role: true,
      },
      withDeleted: true,
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
