import { inject, injectable } from "tsyringe";
import { NoteMapDto } from "@mappers/NoteMapDto";
import { StatusCodes as HTTP } from "http-status-codes";
import { StoreControllerTypes } from "types/controllers/Note/StoreController";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

import { resourceToEntityReference } from "@helpers/resourceToEntityReference";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(
    request: StoreControllerTypes.v1.Request,
    response: StoreControllerTypes.v1.Response
  ) {
    const {
      userId,
      body: {
        text,
        resource: { id, name },
      },
    } = request;

    const entityReference = resourceToEntityReference(name, id);

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

    const result = this.mapper.mapOneToDto(note, NoteMapDto);

    return this.finalizeRequest(response, HTTP.CREATED, result);
  }
}
