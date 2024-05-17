import { Like } from "typeorm";
import { Tag } from "@db/entities/Tag";
import { inject, injectable } from "tsyringe";
import { TagMapper } from "@mappers/TagMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { ITagRepository } from "types/repositories/ITagRepository";
import { GetAllControllerTypes } from "types/controllers/Tag/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static readonly ALL_VERSIONS = [v1];

  async v1(
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      query: { search },
    } = request;

    const [result, total] = await this._tagRepository.getAllAndCount({
      skip: 0,
      take: 5,
      where: {
        value: search ? Like(`%${search}%`) : undefined,
      },
    });

    const mappedResult = this.mapper.map<Tag>(result).to(TagMapper);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
