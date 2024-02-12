import { DatePrecision } from "@shared/types/enums/DatePrecision";
import { IWorkspaceActivityDataPointDTO } from "@shared/types/DTOs/Workspace";

export namespace GetActivityControllerTypes {
  export namespace v1 {
    export type Params = { id: number };

    export type Query = {
      from: string;

      to: string;

      precision: DatePrecision;

      // @TODO filters (userId)
    };

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<IWorkspaceActivityDataPointDTO[]>;
  }
}
