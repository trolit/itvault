import { inject, injectable } from "tsyringe";
import { PaginatedResult } from "types/Result";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";
import { IEntityMapperService } from "@interfaces/services/IEntityMapperService";

import { BaseController } from "@controllers/BaseController";

const version1 = 1;

@injectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
    @inject(Di.EntityMapperService)
    private _entityMapperService: IEntityMapperService
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: version1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [version1];

  async v1(
    request: CustomRequest<undefined, undefined, IPaginationOptions>,
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

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
