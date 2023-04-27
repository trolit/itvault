import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { RoleDto } from "@dtos/RoleDto";
import { PaginatedResult } from "@utils/Result";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@utils/types";
import { IRoleRepository } from "@interfaces/repository/IRoleRepository";

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
    @inject(Di.UserRepository)
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
      pagination: { take, skip },
    });

    return response.status(HTTP.OK).send({ result, total });
  }
}
