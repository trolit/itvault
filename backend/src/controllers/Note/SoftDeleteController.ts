import { Response } from "express";
import isInteger from "lodash/isInteger";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { INoteRepository } from "types/repositories/INoteRepository";
import { SoftDeleteControllerTypes } from "types/controllers/SoftDeleteController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class SoftDeleteController extends BaseController {
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

  async v1(request: SoftDeleteControllerTypes.v1.Request, response: Response) {
    const {
      userId,
      permissions,
      params: { id },
    } = request;

    const parsedId = parseInt(id);

    if (!isInteger(parsedId)) {
      return response.sendStatus(HTTP.BAD_REQUEST);
    }

    const note = await this._noteRepository.getOne({
      where: {
        id: parsedId,
      },
      relations: {
        createdBy: true,
      },
    });

    if (!note) {
      return response.sendStatus(HTTP.NO_CONTENT);
    }

    if (
      note.createdBy.id !== userId &&
      !isPermissionEnabled(Permission.DeleteAnyNote, permissions)
    ) {
      return response.sendStatus(HTTP.FORBIDDEN);
    }

    await this._noteRepository.softDeleteEntity(note);

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
