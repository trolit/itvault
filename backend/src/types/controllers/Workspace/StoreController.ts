import { WorkspaceMapDto } from "@dtos/mappers/WorkspaceMapDto";
import { AddEditWorkspaceDto } from "@dtos/AddEditWorkspaceDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<undefined, AddEditWorkspaceDto>;

    export type Response = CustomResponse<WorkspaceMapDto | string>;
  }
}
