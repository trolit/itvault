import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { Workspace } from "@entities/Workspace";
import { WorkspaceDto } from "@dtos/WorkspaceDto";
import { PaginatedResult } from "@utils/Result";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@utils/types";
import { IEntityMapperService } from "@interfaces/service/IEntityMapperService";
import { IWorkspaceRepository } from "@interfaces/repository/IWorkspaceRepository";

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
      query: { skip, take },
    } = request;

    const [result, total] = await this._workspaceRepository.getAll(
      take,
      skip,
      request.permissions[Permission.ViewAllWorkflows] ? undefined : userId
    );

    const mappedResult = this._entityMapperService.mapToDto(
      result,
      WorkspaceDto,
      (from: Workspace) => ({ isProtected: !!from.password })
    );

    return response.status(HTTP.OK).send({ result: mappedResult, total });
  }
}
