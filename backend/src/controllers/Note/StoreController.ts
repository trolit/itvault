import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Note } from "@entities/Note";
import { NoteDto, Target } from "@dtos/NoteDto";
import { IController } from "@interfaces/IController";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

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
      body: { id, text, target },
    } = request;

    const entityReference = this._toEntityReference({ id, target });

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

  private _toEntityReference({ id, target }: Pick<NoteDto, "id" | "target">) {
    switch (target) {
      case Target.file: {
        return {
          file: {
            id,
          },
        };
      }
    }
  }
}
