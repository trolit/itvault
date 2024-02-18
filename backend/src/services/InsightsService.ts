import { inject, injectable } from "tsyringe";
import { IDateService } from "types/services/IDateService";
import { WorkspaceTrace } from "@db/entities/WorkspaceTrace";
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
    data: WorkspaceTrace[];
    precision: DatePrecision;
  }): IWorkspaceActivityDataPointDTO[] {
    const { data, precision } = arg;

    if (!data.length) {
      return [];
    }

    const arrayOfX = this._dateService.getUniqueDatesToPrecision(
      data.map(item => item.createdAt),
      precision
    );

    arrayOfX.sort((date1, date2) => {
      const date1Time = new Date(date1).getTime();
      const date2Time = new Date(date2).getTime();

      return date1Time - date2Time;
    });

    const dataPoints: IWorkspaceActivityDataPointDTO[] = [];

    for (const x of arrayOfX) {
      const matchingData = data.filter(item =>
        this._dateService.parse(item.createdAt).isSame(x, precision)
      );

      dataPoints.push({
        x,
        y: matchingData.length,
      });
    }

    return dataPoints;
  }
}
