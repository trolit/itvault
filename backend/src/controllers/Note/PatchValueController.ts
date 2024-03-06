import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { INoteRepository } from "types/repositories/INoteRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { PatchValueControllerTypes } from "types/controllers/Note/PatchValueController";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { getOptionsOfTraceRelatedEntity } from "@helpers/getOptionsOfTraceRelatedEntity";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class PatchValueController extends BaseController {
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

  static ALL_VERSIONS = [v1];

  async v1(request: PatchValueControllerTypes.v1.Request, response: Response) {
    const {
      userId,
      permissions,
      query: { workspaceId },
      params: { id },
      body: { text },
    } = request;

    const note = await this._noteRepository.getOne({
      where: {
        id,
        createdBy: {
          id: isPermissionEnabled(Permission.UpdateAnyNote, permissions)
            ? undefined
            : userId,
        },
      },
      relations: {
        file: true,
      },
    });

    if (!note) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    await this._noteRepository.primitiveSave(
      {
        ...note,
        value: text,
        updatedBy: {
          id: userId,
        },
      },
      getOptionsOfTraceRelatedEntity({
        userId,
        workspaceId,
      })
    );

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
