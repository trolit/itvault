import { WorkspaceMapper } from "@mappers/WorkspaceMapper";
import { IAddEditWorkspaceDto } from "@shared/types/dtos/Workspace";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = IAddEditWorkspaceDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<WorkspaceMapper | string>;
  }
}
