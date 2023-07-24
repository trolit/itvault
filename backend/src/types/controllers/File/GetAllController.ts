import { File } from "@entities/File";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Query = {
      blueprintId?: number;

      relativePath?: string;

      workspaceId: number;
    };

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<File[]>;
  }
}
