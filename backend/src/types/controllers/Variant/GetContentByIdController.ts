import { WorkspaceId } from "types/controllers/WorkspaceId";

export namespace GetContentByIdControllerTypes {
  export namespace v1 {
    type Params = {
      id: string;
    };

    type Query = WorkspaceId;

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<string>;
  }
}
