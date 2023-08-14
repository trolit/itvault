import { inject, injectable } from "tsyringe";
import { NoteMapper } from "@mappers/NoteMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { INoteRepository } from "types/repositories/INoteRepository";
import { GetAllControllerTypes } from "types/controllers/Note/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { Note } from "@entities/Note";
import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

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

  private get _select(): FindOptionsSelect<Note> {
    return {
      id: true,
      value: true,
      createdAt: true,
      updatedAt: true,
      createdBy: {
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
      query: { id, resource, skip, take },
    } = request;

    const entityReference = resourceToEntityReference(resource, id);

    const where: FindOptionsWhere<Note> = {
      ...entityReference,
    };

    const [result, total] = await this._noteRepository.getAll({
      select: this._select,
      skip,
      take,
      where,
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
