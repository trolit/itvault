import { WorkspaceTrace } from "@db/entities/WorkspaceTrace";
import { DatePrecision } from "@shared/types/enums/DatePrecision";
import { IWorkspaceActivityDataPointDTO } from "@shared/types/DTOs/Workspace";

export interface IInsightsService {
  createDataPoints(arg: {
    data: WorkspaceTrace[];
    precision: DatePrecision;
  }): IWorkspaceActivityDataPointDTO[];
}
