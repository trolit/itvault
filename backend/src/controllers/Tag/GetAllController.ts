import { Like } from "typeorm";
import { inject, injectable } from "tsyringe";
import { TagMapDto } from "@mappers/TagMapDto";
import { StatusCodes as HTTP } from "http-status-codes";
import { GetAllControllerTypes } from "types/controllers/Tag/GetAllController";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { ITagRepository } from "@interfaces/repositories/ITagRepository";

import { BaseController } from "@controllers/BaseController";

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
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
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

    const mappedResult = this.mapper.mapToDto(result, TagMapDto);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
