import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { UserMapDto } from "@dtos/UserMapDto";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";
import {
  ControllerImplementation,
  PaginatedResponse,
} from "miscellaneous-types";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository
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
    request: CustomRequest<undefined, undefined, IPaginationOptions>,
    response: CustomResponse<PaginatedResponse<UserMapDto>>
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

    const mappedResult = this.mapper.mapToDto(result, UserMapDto);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
