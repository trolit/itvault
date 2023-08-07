import { FindOptionsSelect } from "typeorm";
import { inject, injectable } from "tsyringe";
import { NoteMapDto } from "@mappers/NoteMapDto";
import { StatusCodes as HTTP } from "http-status-codes";
import { GetAllNotesByIdControllerTypes } from "types/controllers/User/GetAllNotesByIdController";

import { Di } from "@enums/Di";
import { Note } from "@entities/Note";
import { Permission } from "@enums/Permission";
import { ControllerImplementation } from "miscellaneous-types";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllNotesByIdController extends BaseController {
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

  static ITEMS_PER_PAGE = 5;

  private get _select(): FindOptionsSelect<Note> {
    return {
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
    };
  }

  async v1(
    request: GetAllNotesByIdControllerTypes.v1.Request,
    response: GetAllNotesByIdControllerTypes.v1.Response
  ) {
    const {
      permissions,
      params: { id },
      query: { skip },
    } = request;

    if (!isPermissionEnabled(Permission.ViewUserNotes, permissions)) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const [result, total] = await this._noteRepository.getAll({
      skip,
      take: GetAllNotesByIdController.ITEMS_PER_PAGE,
      select: this._select,
      where: [
        {
          createdBy: {
            id,
          },
        },
        {
          updatedBy: {
            id,
          },
        },
      ],
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
