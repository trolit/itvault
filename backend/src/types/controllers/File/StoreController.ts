import { WorkspaceId } from "miscellaneous-types";
import { FileMapDto } from "@mappers/FileMapDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<FileMapDto[]>;
  }
}
