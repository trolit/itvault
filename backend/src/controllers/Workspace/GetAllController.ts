import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { Workspace } from "@entities/Workspace";
import { WorkspaceDto } from "@dtos/WorkspaceDto";
import { PaginatedResult } from "@utilities/Result";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@utilities/types";
import { IPermissionService } from "@interfaces/IPermissionService";
import { IWorkspaceRepository } from "@interfaces/IWorkspaceRepository";
import { IEntityMapperService } from "@interfaces/IEntityMapperService";

interface IQueryParams {
  skip: number;

  take: number;
}

@autoInjectable()
export class GetAllController
  implements
    IController<IQueryParams, undefined, PaginatedResult<WorkspaceDto>>
{
  constructor(
    @inject(Di.WorkspaceRepository)
    private workspaceRepository: IWorkspaceRepository,
    @inject(Di.EntityMapperService)
    private entityMapperService: IEntityMapperService,
    @inject(Di.PermissionService) private permissionService: IPermissionService
  ) {}
  async invoke(
    request: CustomRequest<undefined, IQueryParams>,
    response: CustomResponse<PaginatedResult<WorkspaceDto>>
  ) {
    const {
      userId,
      query: { skip, take },
    } = request;

    const isPermittedToSeeAllWorkflows =
      await this.permissionService.hasPermission(
        userId,
        Permission.ViewAllWorkflows
      );

    const [result, total] = await this.workspaceRepository.getAll(
      take,
      skip,
      isPermittedToSeeAllWorkflows ? undefined : userId
    );

    const mappedResult = this.entityMapperService.mapToDto(
      result,
      WorkspaceDto,
      (from: Workspace) => ({ isProtected: !!from.password })
    );

    return response.status(HTTP.OK).send({ result: mappedResult, total });
  }
}
