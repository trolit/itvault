import { WorkspaceId } from "types/controllers/WorkspaceId";

export namespace HardDeleteControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Params = {
      id: number;
    };

    export type Request = CustomRequest<Params, undefined, Query>;
  }
}
