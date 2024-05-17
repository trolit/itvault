import { Between } from "typeorm";
import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IDateService } from "types/services/IDateService";
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
    private _insightsService: IInsightsService,
    @inject(Di.DateService)
    private _dateService: IDateService
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
    request: GetTracesSeriesControllerTypes.v1.Request,
    response: GetTracesSeriesControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { from: unixFrom, to: unixTo, precision, filters },
    } = request;

    const from = this._dateService.parse(unixFrom).toDate();
    const to = this._dateService.parse(unixTo).toDate();

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
