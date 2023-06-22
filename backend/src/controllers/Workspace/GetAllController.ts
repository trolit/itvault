import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { WorkspaceDto } from "@dtos/WorkspaceDto";
import { PaginatedResult } from "@utils/Result";
import { IController } from "types/interfaces/IController";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";
import { CustomRequest, CustomResponse } from "@custom-types/express";
import { IEntityMapperService } from "types/interfaces/service/IEntityMapperService";
import { IWorkspaceRepository } from "types/interfaces/repository/IWorkspaceRepository";

interface IQuery {
  skip: number;

  take: number;
}

@autoInjectable()
export class GetAllController
  implements
    IController<undefined, undefined, IQuery, PaginatedResult<WorkspaceDto>>
{
  constructor(
    @inject(Di.WorkspaceRepository)
    private _workspaceRepository: IWorkspaceRepository,
    @inject(Di.EntityMapperService)
    private _entityMapperService: IEntityMapperService
  ) {}

  async invoke(
    request: CustomRequest<undefined, undefined, IQuery>,
    response: CustomResponse<PaginatedResult<WorkspaceDto>>
  ) {
    const {
      userId,
      permissions,
      query: { skip, take },
    } = request;

    const [result, total] = await this._workspaceRepository.getAll({
      skip,
      take,
      order: {
        name: "asc",
      },
      where: {
        userToWorkspace: {
          userId: isPermissionEnabled(Permission.ViewAllWorkspaces, permissions)
            ? undefined
            : userId,
        },
      },
      relations: {
        userToWorkspace: true,
      },
    });

    const mappedResult = this._entityMapperService.mapToDto(
      result,
      WorkspaceDto
    );

    return response.status(HTTP.OK).send({ result: mappedResult, total });
  }
}
