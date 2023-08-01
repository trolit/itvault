import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { SoftDeleteControllerTypes } from "types/controllers/SoftDeleteController";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { ControllerImplementation } from "miscellaneous-types";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

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

    if (isNaN(parsedId)) {
      return response.status(HTTP.NO_CONTENT).send();
    }

    const note = await this._noteRepository.getOne({
      where: {
        id: parsedId,
        createdBy: {
          id: isPermissionEnabled(Permission.DeleteAnyNote, permissions)
            ? undefined
            : userId,
        },
      },
    });

    if (!note) {
      return response.status(HTTP.NO_CONTENT).send();
    }

    await this._noteRepository.softRemoveEntity(note);

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
