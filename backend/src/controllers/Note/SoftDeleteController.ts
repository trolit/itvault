import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { INoteRepository } from "types/repositories/INoteRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { DeleteControllerWithIntegerTypes } from "types/controllers/DeleteControllerWithInteger";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { getOptionsOfTraceRelatedEntity } from "@helpers/getOptionsOfTraceRelatedEntity";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static readonly ALL_VERSIONS = [v1];

  async v1(
    request: DeleteControllerWithIntegerTypes.v1.Request,
    response: Response
  ) {
    const {
      userId,
      permissions,
      params: { id },
      query: { workspaceId },
    } = request;

    const note = await this._noteRepository.getOne({
      where: {
        id,
        file: {
          workspace: {
            id: workspaceId,
          },
        },
      },
      relations: {
        createdBy: true,
      },
    });

    if (!note) {
      return response.sendStatus(HTTP.NO_CONTENT);
    }

    if (
      note.createdBy?.id !== userId &&
      !isPermissionEnabled(Permission.DeleteAnyNote, permissions)
    ) {
      return response.sendStatus(HTTP.FORBIDDEN);
    }

    await this._noteRepository.softDeleteEntity(
      note,
      getOptionsOfTraceRelatedEntity({
        userId,
        workspaceId,
      })
    );

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
