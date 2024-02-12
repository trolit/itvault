import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { WorkspaceTrace } from "@db/entities/WorkspaceTrace";
import { WorkspaceTraceMapper } from "@mappers/WorkspaceTraceMapper";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { IWorkspaceEventRepository } from "types/repositories/IWorkspaceEventRepository";
import { GetEventsControllerTypes } from "types/controllers/Workspace/GetEventsController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@autoInjectable()
export class GetEventsController extends BaseController {
  constructor(
    @inject(Di.WorkspaceEventRepository)
    private _workspaceEventRepository: IWorkspaceEventRepository
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1];

  async v1(
    request: GetEventsControllerTypes.v1.Request,
    response: GetEventsControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { skip, take },
    } = request;

    const [data, total] = await this._workspaceEventRepository.getAllAndCount({
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
