import { Not } from "typeorm";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Di } from "@enums/Di";
import { RoleDto } from "@dtos/RoleDto";
import { IRoleRepository } from "@interfaces/repositories/IRoleRepository";
import {
  ControllerImplementation,
  PaginatedResponse,
} from "miscellaneous-types";

import { BaseController } from "@controllers/BaseController";

interface IQuery {
  skip: number;

  take: number;
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(
    request: CustomRequest<undefined, undefined, IQuery>,
    response: CustomResponse<PaginatedResponse<RoleDto>>
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
