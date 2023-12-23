import { IAddEditWorkspaceDto } from "@shared/types/dtos/Workspace";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IAddEditWorkspaceDto;

    export type Request = CustomRequest<Params, IAddEditWorkspaceDto>;

    export type Response = CustomResponse<string>;
  }
}
