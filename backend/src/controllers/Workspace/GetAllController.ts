import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { Workspace } from "@entities/Workspace";
import { WorkspaceDto } from "@dtos/WorkspaceDto";
import { PaginatedResult } from "@utils/Result";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@utils/types";
import { IPermissionService } from "@interfaces/service/IPermissionService";
import { IWorkspaceRepository } from "@interfaces/repository/IWorkspaceRepository";
import { IEntityMapperService } from "@interfaces/service/IEntityMapperService";

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
    private _entityMapperService: IEntityMapperService,
    @inject(Di.PermissionService)
    private _permissionService: IPermissionService
  ) {}

  async invoke(
    request: CustomRequest<undefined, undefined, IQuery>,
    response: CustomResponse<PaginatedResult<WorkspaceDto>>
  ) {
    const {
      userId,
      query: { skip, take },
    } = request;

    const isPermittedToSeeAllWorkflows =
      await this._permissionService.hasPermission(
        userId,
        Permission.ViewAllWorkflows
      );

    const [result, total] = await this._workspaceRepository.getAll(
      take,
      skip,
      isPermittedToSeeAllWorkflows ? undefined : userId
    );

    const mappedResult = this._entityMapperService.mapToDto(
      result,
      WorkspaceDto,
      (from: Workspace) => ({ isProtected: !!from.password })
    );

    return response.status(HTTP.OK).send({ result: mappedResult, total });
  }
}
