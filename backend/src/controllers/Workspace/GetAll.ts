import { IsNull } from "typeorm";
import { Request } from "express";
import { autoInjectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Workspace } from "@entities/Workspace";
import { dataSource } from "@config/data-source";
import { WorkspaceDto } from "@dtos/WorkspaceDto";
import { PaginatedResult } from "@utilities/Result";
import { IController } from "@interfaces/IController";
import { EntityMapperService } from "@services/EntityMapper";
import { RequestWithQuery, ResponseOfType } from "@utilities/types";
import { WorkspaceRepository } from "@repositories/WorkspaceRepository";
interface QueryParams {
  take?: number;

  skip?: number;
}

@autoInjectable()
export class GetAllController implements IController {
  private _workspaceRepository: WorkspaceRepository;

  constructor(private _entityMapperService?: EntityMapperService) {
    this._workspaceRepository = dataSource.getRepository(Workspace);
  }

  async invoke(
    request: Request<unknown, unknown, unknown, QueryParams>,
    response: ResponseOfType<PaginatedResult<WorkspaceDto>>
  ) {
    if (
      !this._workspaceRepository ||
      !this._entityMapperService ||
      !request.userId
    ) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const { take, skip } = request.query;

    const [result, total] = await this._workspaceRepository.findAndCount({
      take,
      skip,
      order: {
        name: "asc",
      },
      where: {
        deletedAt: IsNull(),
        userToWorkspace: {
          userId: request.userId,
        },
      },
      relations: {
        userToWorkspace: true,
      },
    });

    const mappedResult = this._entityMapperService.mapToDto(
      result,
      WorkspaceDto,
      (from: Workspace) => ({ isProtected: !!from.password })
    );

    return response.status(HTTP.OK).send({ result: mappedResult, total });
  }
}
