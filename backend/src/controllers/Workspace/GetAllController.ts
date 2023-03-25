import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Workspace } from "@entities/Workspace";
import { WorkspaceDto } from "@dtos/WorkspaceDto";
import { PaginatedResult } from "@utilities/Result";
import { IController } from "@interfaces/IController";
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
    private entityMapperService: IEntityMapperService
  ) {}

  async invoke(
    request: RequestWithQuery<QueryParams>,
    response: ResponseOfType<PaginatedResult<WorkspaceDto>>
  ) {
    const { take, skip } = request.query;

    // @TODO - handle take/skip
    // @TODO - handle userId
    const [result, total] = await this.workspaceRepository.getAll(5, 0);

    const mappedResult = this.entityMapperService.mapToDto(
      result,
      WorkspaceDto,
      (from: Workspace) => ({ isProtected: !!from.password })
    );

    return response.status(HTTP.OK).send({ result: mappedResult, total });
  }
}
