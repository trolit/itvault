import { WorkspaceId } from "types/controllers/WorkspaceId";

export namespace DeleteControllerWithIntegerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, void, Query>;
  }
}
