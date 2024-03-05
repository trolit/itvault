import { WorkspaceId } from "./WorkspaceId";

export namespace DeleteControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Params = {
      id: string;
    };

    export type Request = CustomRequest<Params, undefined, Query>;
  }
}
