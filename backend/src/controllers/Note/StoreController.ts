import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Note } from "@entities/Note";
import { NoteDto } from "@dtos/NoteDto";
import { ControllerImplementation } from "miscellaneous-types";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

import { resourceToEntityReference } from "@helpers/resourceToEntityReference";

import { BaseController } from "@controllers/BaseController";

const version1 = 1;

@injectable()
export class StoreController extends BaseController {
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

    return this.finalizeRequest(response, HTTP.CREATED, note);
  }
}
