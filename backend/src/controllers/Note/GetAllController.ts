import { inject, injectable } from "tsyringe";
import { PaginatedResult } from "types/Result";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Note } from "@entities/Note";
import { NoteDto } from "@dtos/NoteDto";
import { IController } from "@interfaces/IController";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

import { resourceToEntityReference } from "@helpers/resourceToEntityReference";

type Query = Pick<NoteDto, "id" | "resource"> & IPaginationOptions;

@injectable()
export class GetAllController
  implements IController<undefined, undefined, Query, PaginatedResult<Note>>
{
  constructor(
    @inject(Di.NoteRepository)
    private _noteRepository: INoteRepository
  ) {}

  async invoke(
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

    return response.status(HTTP.OK).send({ result, total });
  }
}
