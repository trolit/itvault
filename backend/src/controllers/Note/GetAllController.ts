import { Note } from "@db/entities/Note";
import { FindOptionsSelect } from "typeorm";
import { inject, injectable } from "tsyringe";
import { NoteMapper } from "@mappers/NoteMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { INoteRepository } from "types/repositories/INoteRepository";
import { GetAllControllerTypes } from "types/controllers/Note/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static readonly ALL_VERSIONS = [v1];

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
        fullName: true,
      },
    };
  }

  async v1(
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      permissions,
      query: { fileId, skip, take },
    } = request;

    const [result, total] = await this._noteRepository.getAllAndCount({
      select: this._select,
      skip,
      take,
      where: {
        file: {
          id: fileId,
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
