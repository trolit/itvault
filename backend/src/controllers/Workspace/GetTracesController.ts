import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { WorkspaceTrace } from "@db/entities/WorkspaceTrace";
import { WorkspaceTraceMapper } from "@mappers/WorkspaceTraceMapper";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { IWorkspaceTraceRepository } from "types/repositories/IWorkspaceTraceRepository";
import { GetTracesControllerTypes } from "types/controllers/Workspace/GetTracesController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@autoInjectable()
export class GetTracesController extends BaseController {
  constructor(
    @inject(Di.WorkspaceTraceRepository)
    private _workspaceTraceRepository: IWorkspaceTraceRepository
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

  async v1(
    request: GetTracesControllerTypes.v1.Request,
    response: GetTracesControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { skip, take },
    } = request;

    const [data, total] = await this._workspaceTraceRepository.getAllAndCount({
      skip,
      take,
      order: {
        createdAt: "desc",
      },
      where: {
        workspace: {
          id,
        },
      },
      relations: {
        user: true,
      },
    });

    const result = this.mapper
      .map<WorkspaceTrace>(data)
      .to(WorkspaceTraceMapper);

    return this.finalizeRequest(response, HTTP.OK, {
      result,
      total,
    });
  }
}
