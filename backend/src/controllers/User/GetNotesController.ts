import { Note } from "@db/entities/Note";
import { FindOptionsSelect } from "typeorm";
import { inject, injectable } from "tsyringe";
import { NoteMapper } from "@mappers/NoteMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { INoteRepository } from "types/repositories/INoteRepository";
import { GetNotesControllerTypes } from "types/controllers/User/GetNotesController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetNotesController extends BaseController {
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

  static ITEMS_PER_PAGE = 5;

  private get _select(): FindOptionsSelect<Note> {
    return {
      id: true,
      value: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      createdBy: {
        id: true,
        fullName: true,
        role: {
          name: true,
        },
      },
      updatedBy: {
        id: true,
        fullName: true,
      },
    };
  }

  async v1(
    request: GetNotesControllerTypes.v1.Request,
    response: GetNotesControllerTypes.v1.Response
  ) {
    const {
      permissions,
      params: { id },
      query: { skip },
    } = request;

    if (!isPermissionEnabled(Permission.ViewUserNotes, permissions)) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const [result, total] = await this._noteRepository.getAllAndCount({
      skip,
      take: GetNotesController.ITEMS_PER_PAGE,
      select: this._select,
      where: {
        createdBy: {
          id,
        },
      },
      order: {
        createdAt: "desc",
      },
      relations: {
        createdBy: {
          role: true,
        },
        updatedBy: true,
      },
      withDeleted: isPermissionEnabled(
        Permission.ViewDeletedNotes,
        permissions
      ),
    });

    const mappedResult = this.mapper.map<Note>(result).to(NoteMapper);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
