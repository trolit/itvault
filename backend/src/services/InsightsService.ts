import { inject, injectable } from "tsyringe";
import { IDateService } from "types/services/IDateService";
import { WorkspaceEvent } from "@db/entities/WorkspaceEvent";
import { IInsightsService } from "types/services/IInsightsService";

import { Di } from "@enums/Di";
import { DatePrecision } from "@shared/types/enums/DatePrecision";
import { IWorkspaceActivityDataPointDTO } from "@shared/types/DTOs/Workspace";

@injectable()
export class InsightsService implements IInsightsService {
  constructor(
    @inject(Di.DateService)
    private _dateService: IDateService
  ) {}

  createDataPoints(arg: {
    data: WorkspaceEvent[];
    precision: DatePrecision;
  }): IWorkspaceActivityDataPointDTO[] {
    const { data, precision } = arg;

    if (!data.length) {
      return [];
    }

    const arrayOfX = this._dateService.getUniqueDatesToPrecision(
      data.map(item => item.createdAt.toISOString()),
      precision
    );

    const dataPoints: IWorkspaceActivityDataPointDTO[] = [];

    for (const x of arrayOfX) {
      dataPoints.push({
        x,
        y: data.filter(item => item.createdAt.toISOString().startsWith(x))
          .length,
      });
    }

    return dataPoints;
  }
}
