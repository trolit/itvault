import { inject, injectable } from "tsyringe";
import { PaginatedResult } from "types/Result";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Note } from "@entities/Note";
import { Resource } from "@enums/Resource";
import { IController } from "@interfaces/IController";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

import { resourceToEntityReference } from "@helpers/resourceToEntityReference";

type Query = {
  id: number;

  resource: Resource;
} & IPaginationOptions;

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
      skip,
      take,
      where: {
        ...entityReference,
      },
    });

    return response.status(HTTP.OK).send({ result, total });
  }
}
