import { Between } from "typeorm";
import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IInsightsService } from "types/services/IInsightsService";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { IWorkspaceEventRepository } from "types/repositories/IWorkspaceEventRepository";
import { GetActivityControllerTypes } from "types/controllers/Workspace/GetActivityController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@autoInjectable()
export class GetActivityController extends BaseController {
  constructor(
    @inject(Di.WorkspaceEventRepository)
    private _workspaceEventRepository: IWorkspaceEventRepository,
    @inject(Di.InsightsService)
    private _insightsService: IInsightsService
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
    request: GetActivityControllerTypes.v1.Request,
    response: GetActivityControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { from, to, precision, filters },
    } = request;

    const data = await this._workspaceEventRepository.getAll({
      where: {
        workspace: {
          id,
        },
        user: {
          id: filters.userId,
        },
        createdAt: Between(from, to),
      },
    });

    const dataPoints = this._insightsService.createDataPoints({
      data,
      precision,
    });

    return this.finalizeRequest(response, HTTP.OK, dataPoints);
  }
}
