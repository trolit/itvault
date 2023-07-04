import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Note } from "@entities/Note";
import { NoteDto } from "@dtos/NoteDto";
import { IController } from "@interfaces/IController";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

import { resourceToEntityReference } from "@helpers/resourceToEntityReference";

@injectable()
export class StoreController
  implements IController<undefined, NoteDto, undefined, Note>
{
  constructor(
    @inject(Di.NoteRepository)
    private _noteRepository: INoteRepository
  ) {}

  async invoke(
    request: CustomRequest<undefined, NoteDto>,
    response: CustomResponse<Note>
  ) {
    const {
      userId,
      body: { id, text, resource },
    } = request;

    const entityReference = resourceToEntityReference(resource, id);

    if (!entityReference) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const note = await this._noteRepository.primitiveSave({
      value: text,
      createdBy: {
        id: userId,
      },
      updatedBy: {
        id: userId,
      },
      ...entityReference,
    });

    if (!note) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return response.status(HTTP.CREATED).send(note);
  }
}
