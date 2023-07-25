import { FileMapDto } from "@dtos/FileMapDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    type Query = {
      workspaceId: number;
    };

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<FileMapDto[]>;
  }
}
