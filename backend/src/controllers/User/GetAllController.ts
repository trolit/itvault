import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { PaginatedResult } from "@utilities/Result";
import { IController } from "@interfaces/IController";
import { IUserRepository } from "@interfaces/IUserRepository";
import { CustomRequest, CustomResponse } from "@utilities/types";
import { IEntityMapperService } from "@interfaces/IEntityMapperService";

interface IQueryParams {
  skip: number;

  take: number;
}

@injectable()
export class GetAllController
  implements IController<undefined, IQueryParams, PaginatedResult<UserDto>>
{
  constructor(
    @inject(Di.UserRepository) private userRepository: IUserRepository,
    @inject(Di.EntityMapperService)
    private entityMapperService: IEntityMapperService
  ) {}

  async invoke(
    request: CustomRequest<undefined, IQueryParams>,
    response: CustomResponse<PaginatedResult<UserDto>>
  ) {
    const {
      query: { skip, take },
    } = request;

    const [result, total] = await this.userRepository.getAll(take, skip);

    const mappedResult = this.entityMapperService.mapToDto(
      result,
      UserDto,
      ({ role: { id, name } }) => ({
        roleId: id,
        roleName: name,
      })
    );

    return response.status(HTTP.OK).send({ result: mappedResult, total });
  }
}
