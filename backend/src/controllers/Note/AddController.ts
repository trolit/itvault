import { inject, injectable } from "tsyringe";
import { NoteMapper } from "@mappers/NoteMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { INoteRepository } from "types/repositories/INoteRepository";
import { AddControllerTypes } from "types/controllers/Note/AddController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { getOptionsOfTraceRelatedEntity } from "@helpers/getOptionsOfTraceRelatedEntity";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class AddController extends BaseController {
  constructor(
    @inject(Di.NoteRepository)
    private _noteRepository: INoteRepository
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
    request: AddControllerTypes.v1.Request,
    response: AddControllerTypes.v1.Response
  ) {
    const {
      userId,
      query: { workspaceId },
      body: { text, fileId },
    } = request;

    const note = await this._noteRepository.primitiveSave(
      {
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
      },
      getOptionsOfTraceRelatedEntity({
        userId,
        workspaceId,
      })
    );

    if (!note) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    const result = this.mapper.map(note).to(NoteMapper);

    return this.finalizeRequest(response, HTTP.CREATED, result);
  }
}
