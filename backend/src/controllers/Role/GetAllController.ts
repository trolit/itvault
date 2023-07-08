import { Not } from "typeorm";
import { inject, injectable } from "tsyringe";
import { PaginatedResult } from "types/Result";
import { StatusCodes as HTTP } from "http-status-codes";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Di } from "@enums/Di";
import { RoleDto } from "@dtos/RoleDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IRoleRepository } from "@interfaces/repositories/IRoleRepository";

import { BaseController } from "@controllers/BaseController";

interface IQuery {
  skip: number;

  take: number;
}

const version1 = 1;

@injectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.RoleRepository)
    private _roleRepository: IRoleRepository
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

    return this.finalizeRequest(response, HTTP.OK, { result, total });
  }
}
