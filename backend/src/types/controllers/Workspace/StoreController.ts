import { WorkspaceMapDto } from "@dtos/mappers/WorkspaceMapDto";
import { AddEditWorkspaceDto } from "@dtos/AddEditWorkspaceDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddEditWorkspaceDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<WorkspaceMapDto | string>;
  }
}
