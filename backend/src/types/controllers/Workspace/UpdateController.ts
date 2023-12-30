import { IAddEditWorkspaceDTO } from "@shared/types/dtos/Workspace";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IAddEditWorkspaceDTO;

    export type Request = CustomRequest<Params, IAddEditWorkspaceDTO>;

    export type Response = CustomResponse<string>;
  }
}
