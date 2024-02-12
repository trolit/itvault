import { WorkspaceEvent } from "@db/entities/WorkspaceEvent";
import { IWorkspaceActivityDataPointDTO } from "@shared/types/DTOs/Workspace";
import { DatePrecision } from "@shared/types/enums/DatePrecision";

export interface IInsightsService {
  createDataPoints(arg: {
    data: WorkspaceEvent[];
    precision: DatePrecision;
  }): IWorkspaceActivityDataPointDTO[];
}
