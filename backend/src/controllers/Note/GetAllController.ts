import { FindOptionsWhere } from "typeorm";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { GetAllControllerTypes } from "types/controllers/Note/GetAllController";

import { Di } from "@enums/Di";
import { Note } from "@entities/Note";
import { Permission } from "@enums/Permission";
import { NoteMapDto } from "@dtos/mappers/NoteMapDto";
import { ControllerImplementation } from "miscellaneous-types";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

import { isPermissionEnabled } from "@helpers/isPermissionEnabled";
import { resourceToEntityReference } from "@helpers/resourceToEntityReference";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllController extends BaseController {
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
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      permissions,
      query: { id, resource, skip, take, userId },
    } = request;

    const entityReference = resourceToEntityReference(resource, id);

    const where: FindOptionsWhere<Note> = {
      ...entityReference,
    };

    if (userId && !isPermissionEnabled(Permission.ViewUserNotes, permissions)) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    if (userId) {
      where.createdBy = {
        id: userId,
      };
    }

    const [result, total] = await this._noteRepository.getAll({
      select: {
        id: true,
        value: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          fullName: true,
        },
        updatedBy: {
          fullName: true,
        },
      },
      skip,
      take,
      where,
      relations: {
        createdBy: true,
        updatedBy: true,
      },
      withDeleted: isPermissionEnabled(
        Permission.ViewDeletedNotes,
        permissions
      ),
    });

    const mappedResult = this.mapper.mapToDto(result, NoteMapDto);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
