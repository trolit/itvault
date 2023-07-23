import { Like } from "typeorm";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Tag } from "@entities/Tag";
import { ITagRepository } from "@interfaces/repositories/ITagRepository";
import {
  ControllerImplementation,
  PaginatedResponse,
} from "miscellaneous-types";

import { BaseController } from "@controllers/BaseController";

export interface IQuery {
  search?: string;
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.TagRepository)
    private _tagRepository: ITagRepository
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
    response: CustomResponse<PaginatedResponse<Tag>>
  ) {
    const {
      query: { search },
    } = request;

    const [result, total] = await this._tagRepository.getAll({
      skip: 0,
      take: 5,
      where: {
        value: search ? Like(`%${search}%`) : undefined,
      },
    });

    return this.finalizeRequest(response, HTTP.OK, { result, total });
  }
}
