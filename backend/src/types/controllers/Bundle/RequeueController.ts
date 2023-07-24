export namespace RequeueControllerTypes {
  export namespace v1 {
    type Params = {
      id: number;
    };

    type Query = {
      workspaceId: number;
    };

    export type Request = CustomRequest<Params, undefined, Query>;
  }
}
