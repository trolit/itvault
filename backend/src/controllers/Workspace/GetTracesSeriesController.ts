import { Between } from "typeorm";
import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IInsightsService } from "types/services/IInsightsService";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { IWorkspaceTraceRepository } from "types/repositories/IWorkspaceTraceRepository";
import { GetTracesSeriesControllerTypes } from "types/controllers/Workspace/GetTracesSeriesController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@autoInjectable()
export class GetTracesSeriesController extends BaseController {
  constructor(
    @inject(Di.WorkspaceTraceRepository)
    private _workspaceTraceRepository: IWorkspaceTraceRepository,
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
    request: GetTracesSeriesControllerTypes.v1.Request,
    response: GetTracesSeriesControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { from, to, precision, filters },
    } = request;

    const data = await this._workspaceTraceRepository.getAll({
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
