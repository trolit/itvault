import { WorkspaceMapper } from "@mappers/WorkspaceMapper";
import { IAddEditWorkspaceDTO } from "@shared/types/dtos/Workspace";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = IAddEditWorkspaceDTO;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<WorkspaceMapper | string>;
  }
}
