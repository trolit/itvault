import { inject, injectable } from "tsyringe";
import { PaginatedResult } from "types/Result";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Note } from "@entities/Note";
import { NoteDto } from "@dtos/NoteDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

import { resourceToEntityReference } from "@helpers/resourceToEntityReference";

import { BaseController } from "@controllers/BaseController";

type Query = Pick<NoteDto, "id" | "resource"> & IPaginationOptions;

const version1 = 1;

@injectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.NoteRepository)
    private _noteRepository: INoteRepository
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
    request: CustomRequest<undefined, undefined, Query>,
    response: CustomResponse<PaginatedResult<Note>>
  ) {
    const {
      query: { id, resource, skip, take },
    } = request;

    const entityReference = resourceToEntityReference(resource, id);

    const [result, total] = await this._noteRepository.getAll({
      select: {
        id: true,
        value: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          fullName: true,
        },
        updatedBy: {
          fullName: true,
        },
      },
      skip,
      take,
      where: {
        ...entityReference,
      },
      relations: {
        createdBy: true,
        updatedBy: true,
      },
    });

    return this.finalizeRequest(response, HTTP.OK, { result, total });
  }
}
