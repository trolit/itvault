import { DatePrecision } from "@shared/types/enums/DatePrecision";
import { IWorkspaceActivityDataPointDTO } from "@shared/types/DTOs/Workspace";

export namespace GetTracesSeriesControllerTypes {
  export namespace v1 {
    export type Params = { id: number };

    export type Query = {
      from: number;

      to: number;

      precision: DatePrecision;

      filters: {
        userId?: number;
      };
    };

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<IWorkspaceActivityDataPointDTO[]>;
  }
}
