import { Not } from "typeorm";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "types/enums/Di";
import { RoleDto } from "@dtos/RoleDto";
import { PaginatedResult } from "@utils/Result";
import { IController } from "types/interfaces/IController";
import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IRoleRepository } from "types/interfaces/repository/IRoleRepository";

interface IQuery {
  skip: number;

  take: number;
}

@injectable()
export class GetAllController
  implements
    IController<undefined, undefined, IQuery, PaginatedResult<RoleDto>>
{
  constructor(
    @inject(Di.RoleRepository)
    private _roleRepository: IRoleRepository
  ) {}

  async invoke(
    request: CustomRequest<undefined, undefined, IQuery>,
    response: CustomResponse<PaginatedResult<RoleDto>>
  ) {
    const {
      query: { skip, take },
    } = request;

    const [result, total] = await this._roleRepository.getAll({
      skip,
      take,
      where: {
        id: Not(HEAD_ADMIN_ROLE_ID),
      },
    });

    return response.status(HTTP.OK).send({ result, total });
  }
}
