import { Like } from "typeorm";
import { inject, injectable } from "tsyringe";
import { PaginatedResult } from "types/Result";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Tag } from "@entities/Tag";
import { ControllerImplementation } from "miscellaneous-types";
import { ITagRepository } from "@interfaces/repositories/ITagRepository";

import { BaseController } from "@controllers/BaseController";

interface IQuery {
  skip: number;

  take: number;

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
    response: CustomResponse<PaginatedResult<Tag>>
  ) {
    const {
      query: { skip, take, search },
    } = request;

    const [result, total] = await this._tagRepository.getAll({
      skip,
      take,
      where: {
        value: search ? Like(`%${search}%`) : undefined,
      },
    });

    return this.finalizeRequest(response, HTTP.OK, { result, total });
  }
}
