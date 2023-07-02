import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Note } from "@entities/Note";
import { NoteDto } from "@dtos/NoteDto";
import { IController } from "@interfaces/IController";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

interface IParams {
  workspaceId: number;
}

@injectable()
export class StoreController
  implements IController<IParams, NoteDto, undefined, Note>
{
  constructor(
    @inject(Di.NoteRepository)
    private _noteRepository: INoteRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams, NoteDto>,
    response: CustomResponse<Note>
  ) {
    const {
      userId,
      body: { fileId, text },
    } = request;

    const note = await this._noteRepository.primitiveSave({
      value: text,
      createdBy: {
        id: userId,
      },
      updatedBy: {
        id: userId,
      },
      file: {
        id: fileId,
      },
    });

    if (!note) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return response.status(HTTP.CREATED).send(note);
  }
}
