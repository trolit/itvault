import { WorkspaceEvent } from "@db/entities/WorkspaceTrace";
import { IWorkspaceActivityDataPointDTO } from "@shared/types/DTOs/Workspace";
import { DatePrecision } from "@shared/types/enums/DatePrecision";

export interface IInsightsService {
  createDataPoints(arg: {
    data: WorkspaceEvent[];
    precision: DatePrecision;
  }): IWorkspaceActivityDataPointDTO[];
}
