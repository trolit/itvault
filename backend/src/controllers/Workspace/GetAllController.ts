import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { Workspace } from "@entities/Workspace";
import { WorkspaceDto } from "@dtos/WorkspaceDto";
import { PaginatedResult } from "@utilities/Result";
import { IController } from "@interfaces/IController";
import { IPermissionService } from "@interfaces/IPermissionService";
import { RequestWithQuery, ResponseOfType } from "@utilities/types";
import { IWorkspaceRepository } from "@interfaces/IWorkspaceRepository";
import { IEntityMapperService } from "@interfaces/IEntityMapperService";

interface QueryParams {
  take?: number;

  skip?: number;
}

@autoInjectable()
export class GetAllController implements IController {
  constructor(
    @inject(Di.WorkspaceRepository)
    private workspaceRepository: IWorkspaceRepository,
    @inject(Di.EntityMapperService)
    private entityMapperService: IEntityMapperService,
    @inject(Di.PermissionService) private permissionService: IPermissionService
  ) {}

  async invoke(
    request: RequestWithQuery<QueryParams>,
    response: ResponseOfType<PaginatedResult<WorkspaceDto>>
  ) {
    const { userId } = request;

    const { take, skip } = request.query;

    const isPermittedToSeeAllWorkflows =
      await this.permissionService.hasPermission(
        userId,
        Permission.ViewAllWorkflows
      );

    // @TODO - handle take/skip
    const [result, total] = await this.workspaceRepository.getAll(
      5,
      0,
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
