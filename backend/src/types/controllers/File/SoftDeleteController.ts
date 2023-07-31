import { WorkspaceId } from "miscellaneous-types";

export namespace SoftDeleteControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, void, Query>;
  }
}
